---
title: More Code Examples
description: More Code Examples
sidebar:
    order: 39
---

Here is a bit of code manually converted to C3 from C.

```c3
const uint OFFSET = 8;
const uint BIN_COUNT = 9;
const uint BIN_MAX_IDX = BIN_COUNT - 1;
const uint OVERHEAD = Footer.sizeof + Node.sizeof;
const usz MIN_WILDERNESS = 0x2000;
const usz MAX_WILDERNESS = 0x1000000;
const usz HEAP_INIT_SIZE = 0x10000;
const usz HEAP_MAX_SIZE = 0xF0000;
const usz HEAP_MIN_SIZE = 0x10000;
const uint MIN_ALLOC_SZ = 4;

struct Node
{
    uint hole;
    uint size;
    Node* next;
    Node* prev;
}

struct Footer
{
    Node *header;
}

struct Bin
{
    Node* head;
}

struct Heap
{
    uptr start;
    uptr end;
    Bin*[BIN_COUNT] bins;
}


/**
 * @require start > 0
 */
fn void Heap.init(&heap, uptr start)
{
    Node* init_region = (Node*)start;
    init_region.hole = 1;
    init_region.size = HEAP_INIT_SIZE - Node.sizeof - Footer.sizeof;

    init_region.create_foot();

    heap.bins[get_bin_index(init_region.size)].add_node(init_region);

    heap.start = start;
    heap.end = start + HEAP_INIT_SIZE;
}

fn void* Heap.alloc(&heap, uint size)
{
    uint index = get_bin_index(size);
    Bin* temp = heap.bins[index];
    Node* found = temp.get_best_fit(size);

    while (!found)
    {
        temp = heap.bins[++index];
        found = temp.get_best_fit(size);
    }

    if (found.size - size > OVERHEAD + MIN_ALLOC_SZ)
    {
        Node* split = (Node*)((void*)found + Node.sizeof + Footer.sizeof) + size;
        split.size = found.size - size - (uint)Node.sizeof - (uint)Footer.sizeof;
        split.hole = 1;

        split.create_foot();

        uint new_idx = get_bin_index(split.size);

        heap.bins[new_idx].add_node(split);

        found.size = size;
        found.create_foot();
    }

    found.hole = 0;
    heap.bins[index].remove_node(found);

    Node* wild = heap.get_wilderness();
    if (wild.size < MIN_WILDERNESS)
    {
        if (!heap.expand(0x1000)) return null;
    }
    else if (wild.size > MAX_WILDERNESS)
    {
        heap.contract(0x1000);
    }

    found.prev = null;
    found.next = null;
    return &found.next;
}

/**
 * @param [&inout] p
 */
fn void Heap.free(&heap, void* p)
{

    Node* head = (void*)p - OFFSET;
    if (head == (Node*)heap.start)
    {
        head.hole = 1;
        heap.bins[get_bin_index(head.size)].add_node(head);
        return;
    }

    Node* next = (void*)head.get_foot() + Footer.sizeof;
    Footer* f = (void*)head - Footer.sizeof;
    Node* prev = f.header;

    Bin* list;
    Footer* new_foot;
    if (prev.hole)
    {
        list = heap.bins[get_bin_index(prev.size)];
        list.remove_node(prev);

        prev.size += OVERHEAD + head.size;
        new_foot = head.get_foot();
        new_foot.header = prev;

        head = prev;
    }

    if (next.hole)
    {
        list = heap.bins[get_bin_index(next.size)];
        list.remove_node(next);

        head.size += OVERHEAD + next.size;

        Footer* old_foot = next.get_foot();
        old_foot.header = null;
        next.size = 0;
        next.hole = 0;

        new_foot = head.get_foot();
        new_foot.header = head;
    }

    head.hole = 1;
    heap.bins[get_bin_index(head.size)].add_node(head);
}

fn uint Heap.expand(&heap, usz sz)
{
    return 0;
}

fn void Heap.contract(&heap, usz sz)
{
    return;
}

fn uint get_bin_index(usz sz)
{
    uint index = 0;
    sz = sz < 4 ? 4 : sz;

    while (sz >>= 1) index++;
    index -= 2;

    if (index > BIN_MAX_IDX) index = BIN_MAX_IDX;
    return index;
}

fn void Node.create_foot(&head)
{
    Footer* foot = head.get_foot();
    foot.header = head;
}

fn Footer* Node.get_foot(&node)
{
    return (void*)node + Node.sizeof + node.size;
}

fn Node* Heap.get_wilderness(&heap)
{
    Footer* wild_foot = (void*)heap.end - Footer.sizeof;
    return wild_foot.header;
}

fn void Bin.remove_node(&bin, Node* node)
{
  if (!bin.head) return;
    if (bin.head == node)
    {
        bin.head = bin.head.next;
        return;
    }

    Node* temp = bin.head.next;
    while (temp)
    {
        if (temp == node)
        {
            if (!temp.next)
            {
                temp.prev.next = null;
            }
            else
            {
                temp.prev.next = temp.next;
                temp.next.prev = temp.prev;
            }
            return;
        }
        temp = temp.next;
    }
}

fn void Bin.add_node(&bin, Node* node)
{
    node.next = null;
    node.prev = null;

    Node* temp = bin.head;

    if (!bin.head)
    {
        bin.head = node;
        return;
    }

    Node* current = bin.head;
    Node* previous = null;

    while (current != null && current.size <= node.size)
    {
        previous = current;
        current = current.next;
    }

    if (!current)
    {
        previous.next = node;
        node.prev = previous;
    }
    else
    {
        if (previous)
        {
            node.next = current;
            previous.next = node;

            node.prev = previous;
            current.prev = node;
        }
        else
        {
            node.next = bin.head;
            bin.head.prev = node;
            bin.head = node;
        }
    }
}

fn Node* Bin.get_best_fit(&bin, usz size)
{
    if (!bin.head) return null;

    Node* temp = bin.head;

    while (temp)
    {
        if (temp.size >= size) return temp;
        temp = temp.next;
    }
    return null;
}
```