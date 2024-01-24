---
title: More Code Examples
description: More Code Examples
sidebar:
    order: 135
---

Here is a bit of code manually converted to C3 from C.

```
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
 * @require heap != null, start > 0
 */
fn void Heap.init(Heap* heap, uptr start)
{
    Node* init_region = (Node*)start;
    init_region.hole = 1;
    init_region.size = HEAP_INIT_SIZE - Node.sizeof - Footer.sizeof;

    init_region.createFoot();

    heap.bins[get_bin_index(init_region.size)].addNode(init_region);

    heap.start = start;
    heap.end = start + HEAP_INIT_SIZE;
}

fn void* Heap.alloc(Heap* heap, uint size)
{
    uint index = get_bin_index(size);
    Bin* temp = (Bin*)heap.bins[index];
    Node* found = temp.getBestFit(size);

    while (!found)
    {
        temp = heap.bins[++index];
        found = temp.getBestFit(size);
    }

    if ((found.size - size) > (OVERHEAD + MIN_ALLOC_SZ))
    {
        Node* split = (Node*)((char*)found + Node.sizeof + Footer.sizeof) + size;
        split.size = found.size - size - (uint)Node.sizeof - (uint)Footer.sizeof;
        split.hole = 1;

        split.createFoot();

        uint new_idx = get_bin_index(split.size);

        heap.bins[new_idx].addNode(split);

        found.size = size;
        found.createFoot();
    }

    found.hole = 0;
    heap.bins[index].removeNode(found);

    Node* wild = heap.getWilderness();
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
 * @require p != null
 */
fn void Heap.free(Heap* heap, void *p)
{
    Bin* list;
    Footer* new_foot, old_foot;

    Node* head = (Node*)((char*)p - OFFSET);
    if (head == (Node*)((uptr)heap.start))
    {
        head.hole = 1;
        heap.bins[get_bin_index(head.size)].addNode(head);
        return;
    }

    Node* next = (Node*)((char*)head.getFoot() + Footer.sizeof);
    Footer* f = (Footer*)((char*)(head) - Footer.sizeof);
    Node* prev = f.header;

    if (prev.hole)
    {
        list = heap.bins[get_bin_index(prev.size)];
        list.removeNode(prev);

        prev.size += OVERHEAD + head.size;
        new_foot = head.getFoot();
        new_foot.header = prev;

        head = prev;
    }

    if (next.hole)
    {
        list = heap.bins[get_bin_index(next.size)];
        list.removeNode(next);

        head.size += OVERHEAD + next.size;

        old_foot = next.getFoot();
        old_foot.header = null;
        next.size = 0;
        next.hole = 0;

        new_foot = head.getFoot();
        new_foot.header = head;
    }

    head.hole = 1;
    heap.bins[get_bin_index(head.size)].addNode(head);
}

fn uint Heap.expand(Heap* heap, usz sz)
{
    return 0;
}

fn void Heap.contract(Heap* heap, usz sz)
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

fn void Node.createFoot(Node* head)
{
    Footer* foot = head.getFoot();
    foot.header = head;
}

fn Footer* Node.getFoot(Node* node)
{
    return (Footer*)((char*)node + Node.sizeof + node.size);
}

fn Node* Heap.getWilderness(Heap* heap)
{
    Footer* wild_foot = (Footer*)((char*)heap.end - Footer.sizeof);
    return wild_foot.header;
}

fn void Bin.removeNode(Bin* bin, Node* node)
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

fn void Bin.addNode(Bin* bin, Node* node)
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

fn Node* Bin.getBestFit(Bin* bin, usz size)
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