---
repo_url: https://github.com/c3lang/c3c
repo_name: c3lang/c3c
hide:
  - navigation
  - toc
  - edit
search:
  exclude: true
---

<style>
  /* Hide the site name and page title in the header, only on this page */
  .md-header__title .md-header__topic {
    display: none !important;
  }

  /* Thick, blurred streak that fades to oblivion at the tips */
  hr {
    border: 0;
    height: 12px;
    margin: 5rem 0;
    background: color-mix(in srgb, var(--md-primary-fg-color), transparent 30%);
    mask-image: linear-gradient(to right, transparent, black 50%, transparent);
    -webkit-mask-image: linear-gradient(to right, transparent, black 50%, transparent);
    filter: blur(2px);
  }

</style>

<main style="padding-top: 2rem;">
  <div class="lp-max-w">
    <div class="lp-grid-2">
      <div style="display: flex; flex-direction: column; gap: 0.5rem; justify-content: center; align-items: center; text-align: center;">
        <!-- Logo shifted here -->
        <div style="display: flex; justify-content: center; margin-bottom: 1rem; position: relative;">
          <div class="lp-logo-aura"></div>
          <a href="getting-started/introduction/" style="display: contents;">
            <img src="assets/logo.svg" alt="C3 Language logo" class="lp-hero-logo" width="353" height="217" style="width: min(100%, 22rem); height: auto; aspect-ratio: 353 / 217;">
            <span class="lp-hero-tooltip">Getting Started <span>→</span></span>
          </a>
        </div>

        <h1 class="lp-title">The <span class="lp-gradient-text">C3</span> Programming Language</h1>
        <p class="lp-subtitle">The Ergonomic, Safe and Familiar Evolution of C</p>
        <div style="display: flex; flex-direction: column; gap: 0.25rem; margin-top: 0.5rem; align-items: center;">
          <div class="lp-download-group" style="justify-content: center;">
            <a id="main-download-btn" href="getting-started/prebuilt-binaries/" class="lp-get-started-btn">
              <span>Download C3 for <span id="os-name">Linux</span></span>
            </a>
            <a href="https://github.com/c3lang/c3c/releases/latest/download/c3-windows.zip" class="lp-icon-btn" title="Download for Windows">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M2 3h9v9H2zm9 19H2v-9h9zM21 3v9h-9V3zm0 19h-9v-9h9z"/></svg>
            </a>
            <a href="https://github.com/c3lang/c3c/releases/latest/download/c3-macos.zip" class="lp-icon-btn" title="Download for macOS">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11"/></svg>
            </a>
            <a href="https://github.com/c3lang/c3c/releases/latest/download/c3-linux-static.tar.gz" class="lp-icon-btn" title="Download for Linux">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M14.62 8.35c-.42.28-1.75 1.04-1.95 1.19-.39.31-.75.29-1.14-.01-.2-.16-1.53-.92-1.95-1.19-.48-.31-.45-.7.08-.92 1.64-.69 3.28-.64 4.91.03.49.21.51.6.05.9m7.22 7.28c-.93-2.09-2.2-3.99-3.84-5.66a4.3 4.3 0 0 1-1.06-1.88c-.1-.33-.17-.67-.24-1.01-.2-.88-.29-1.78-.7-2.61-.73-1.58-2-2.4-3.84-2.47-1.81.05-3.16.81-3.95 2.4-.21.43-.36.88-.46 1.34-.17.76-.32 1.55-.5 2.32-.15.65-.45 1.21-.96 1.71-1.61 1.57-2.9 3.37-3.88 5.35-.14.29-.28.58-.37.88-.19.66.29 1.12.99.96.44-.09.88-.18 1.3-.31.41-.15.57-.05.67.35.65 2.15 2.07 3.66 4.24 4.5 4.12 1.56 8.93-.66 9.97-4.58.07-.27.17-.37.47-.27.46.14.93.24 1.4.35.49.09.85-.16.92-.64.03-.26-.06-.49-.16-.73"/></svg>
            </a>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: var(--md-default-fg-color--light); margin-left: 0.25rem;">
            <span style="font-weight: 700; color: var(--md-default-fg-color);">{{ latest_version }}</span>
            <span style="color: #d1d5db;">|</span>
            <a href="getting-started/prebuilt-binaries/" style="color: inherit; text-decoration: none; font-weight: 500;">
              View all platforms
            </a>
            <svg class="w-2.5 h-2.5" width="16" height="16" viewBox="0 0 16 16" fill="none"> <path d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path> </svg>
            <a href="getting-started/introduction/" style="color: inherit; text-decoration: none; font-weight: 500;">
              Installation Guide
            </a>
          </div>
          <a href="getting-started/introduction/" class="lp-get-started-btn lp-read-docs-btn">
            <span>Read the Docs</span>
          </a>
        </div>
      </div>

      <div class="lp-code-wrapper">
        <div class="lp-code-header">
          <div class="lp-code-dot" style="background-color: #ef4444;"></div>
          <div class="lp-code-dot" style="background-color: #f59e0b;"></div>
          <div class="lp-code-dot" style="background-color: #10b981;"></div>
        </div>
        <div class="lp-code-content">

```c3
module hello;
import std::io;

fn void main()
{
    io::printn("Hello, World!");
}
```
        </div>
      </div>
    </div>
  </div>
</main>

<hr style="width: 34rem; height: 2px; margin: 3.5rem auto 1.5rem auto; background-color: var(--md-default-fg-color--lightest); border: none;">

<div class="lp-max-w" style="margin-top: 4rem;">
  <div class="lp-grid-3" style="gap: 3rem;">
    <!-- Full C ABI Compatibility -->
    <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1.25rem;">
      <span class="lp-feature-icon-wrapper" style="width: 5rem; height: 5rem;" markdown="1">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="m15.45 15.97.42 2.44c-.26.14-.68.27-1.24.39-.57.13-1.24.2-2.01.2-2.21-.04-3.87-.7-4.98-1.96-1.14-1.27-1.68-2.88-1.68-4.83C6 9.9 6.68 8.13 8 6.89 9.28 5.64 10.92 5 12.9 5c.75 0 1.4.07 1.94.19s.94.25 1.2.4l-.6 2.49-1.04-.34c-.4-.1-.87-.15-1.4-.15-1.15-.01-2.11.36-2.86 1.1-.76.73-1.14 1.85-1.18 3.34.01 1.36.37 2.42 1.08 3.2.71.77 1.7 1.17 2.99 1.18l1.33-.12c.43-.08.79-.19 1.09-.32"/></svg>
      </span>
      <div>
        <h3 class="lp-feature-title" style="margin: 0 0 0.75rem 0;">Full C ABI Compatibility</h3>
        <p class="lp-feature-description">
          C3 fits right into your C/C++ application with full C ABI compatibility out of the box.
        </p>
      </div>
    </div>

    <!-- Module System -->
    <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1.25rem;">
      <span class="lp-feature-icon-wrapper" style="width: 5rem; height: 5rem;" markdown="1">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="currentColor" d="M21.993 7.95a.96.96 0 0 0-.029-.214c-.007-.025-.021-.049-.03-.074-.021-.057-.04-.113-.07-.165-.016-.027-.038-.049-.057-.075-.032-.045-.063-.091-.102-.13-.023-.022-.053-.04-.078-.061-.039-.032-.075-.067-.12-.094-.004-.003-.009-.003-.014-.006l-.008-.006-8.979-4.99a1.002 1.002 0 0 0-.97-.001l-9.021 4.99c-.003.003-.006.007-.011.01l-.01.004c-.035.02-.061.049-.094.073-.036.027-.074.051-.106.082-.03.031-.053.067-.079.102-.027.035-.057.066-.079.104-.026.043-.04.092-.059.139-.014.033-.032.064-.041.1a.975.975 0 0 0-.029.21c-.001.017-.007.032-.007.05V16c0 .363.197.698.515.874l8.978 4.987.001.001.002.001.02.011c.043.024.09.037.135.054.032.013.063.03.097.039a1.013 1.013 0 0 0 .506 0c.033-.009.064-.026.097-.039.045-.017.092-.029.135-.054l.02-.011.002-.001.001-.001 8.978-4.987c.316-.176.513-.511.513-.874V7.998c0-.017-.006-.031-.007-.048zm-10.021 3.922L5.058 8.005 7.82 6.477l6.834 3.905-2.682 1.49zm.048-7.719L18.941 8l-2.244 1.247-6.83-3.903 2.153-1.191zM13 19.301l.002-5.679L16 11.944V15l2-1v-3.175l2-1.119v5.705l-7 3.89z"></path></svg>
      </span>
      <div>
        <h3 class="lp-feature-title" style="margin: 0 0 0.75rem 0;">Module System</h3>
        <p class="lp-feature-description">
          A simple and straightforward module system that doesn't get in the way, with defaults that makes sense.
        </p>
      </div>
    </div>

    <!-- Operator Overloading -->
    <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1.25rem;">
      <span class="lp-feature-icon-wrapper" style="width: 5rem; height: 5rem;" markdown="1">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="currentColor" d="M7 2H5v3H2v2h3v3h2V7h3V5H7V2zm7 3h8v2h-8zm0 10h8v2h-8zm0 4h8v2h-8zm-5.71-4.71L6 16.59l-2.29-2.3-1.42 1.42L4.59 18l-2.3 2.29 1.42 1.42L6 19.41l2.29 2.3 1.42-1.42L7.41 18l2.3-2.29-1.42-1.42z"></path></svg>
      </span>
      <div>
        <h3 class="lp-feature-title" style="margin: 0 0 0.75rem 0;">Operator Overloading</h3>
        <p class="lp-feature-description">
          C3 empowers you with precise operator overloading / no baggage, just clean, expressive code.
        </p>
      </div>
    </div>
  </div>
</div>

<hr style="width: 34rem; height: 2px; margin: 4rem auto; background-color: var(--md-default-fg-color--lightest); border: none;">

<div class="lp-max-w">
  <div class="lp-grid-2" style="gap: 4rem; align-items: center; max-width: 56rem; margin: 0 auto;">
    <h2 style="font-size: 2.3rem; font-weight: 800; line-height: 1.2; margin: 0; color: var(--md-default-fg-color);">C3 is an evolution, not a revolution: <span class="lp-gradient-text">the C-like for programmers who like C.</span></h2>
    <div style="display: flex; flex-direction: column; gap: 0.75rem; color: var(--md-default-fg-color--light); line-height: 1.4; font-size: 0.8rem; font-weight: 400;">
      <p style="margin: 0;">C3 is a programming language that builds on the syntax and semantics of the C language, with the goal of evolving it while still retaining familiarity for C programmers.</p>
      <p style="margin: 0;">Thanks to full ABI compatibility with C, it's possible to mix C and C3 in the same project with no effort. As a demonstration, <a href="https://github.com/c3lang/vkQuake" target="_blank" style="color: var(--md-primary-fg-color); font-weight: 600;">vkQuake</a> was compiled with a small portion of the code converted to C3 and compiled with the c3c compiler.</p>
    </div>
  </div>
</div>

<hr style="width: 34rem; height: 2px; margin: 4.5rem auto; background-color: var(--md-default-fg-color--lightest); border: none;">

<div class="lp-max-w" style="margin-top: 4rem;">
  <!-- Global Icon Gradient Definition -->
  <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
    <linearGradient id="lp-icon-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0ea5e9" />
      <stop offset="85%" stop-color="#7c3aed" />
    </linearGradient>
  </svg>

  <div class="lp-grid-4" style="gap: 3.5rem 2rem;">
    <!-- Compile Time and Semantic Macros -->
    <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1rem;">
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24"><path fill="url(#lp-icon-gradient)" d="M6 14c-2.206 0-4 1.794-4 4s1.794 4 4 4a4.003 4.003 0 0 0 3.998-3.98H10V16h4v2.039h.004A4.002 4.002 0 0 0 18 22c2.206 0 4-1.794 4-4s-1.794-4-4-4h-2v-4h2c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4v2h-4V5.98h-.002A4.003 4.003 0 0 0 6 2C3.794 2 2 3.794 2 6s1.794 4 4 4h2v4H6zm2 4c0 1.122-.879 2-2 2s-2-.878-2-2 .879-2 2-2h2v2zm10-2c1.121 0 2 .878 2 2-2-.878-2-2v-2h2zM16 6c0-1.122.879-2 2-2s2 .878 2 2-.879 2-2 2h-2V6zM6 8c-1.121 0-2-.878-2-2s.879-2 2-2 2 .878 2 2v2H6zm4 2h4v4h-4v-4z"/></svg>
      </span>
      <h3 class="lp-feature-title" style="margin: 0; font-size: 1.1rem; font-weight: 700;">Compile Time Macros</h3>
      <p class="lp-feature-description" style="margin: 0; font-size: 0.85rem; line-height: 1.5; color: var(--md-default-fg-color--light);">Unlock the full power of compile-time code with macros that read like functions.</p>
    </div>

    <!-- Gradual Contracts -->
    <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1rem;">
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24"><path fill="url(#lp-icon-gradient)" d="M11.587 6.999H7.702a2 2 0 0 0-1.88 1.316l-3.76 10.342c-.133.365-.042.774.232 1.049l.293.293 6.422-6.422c-.001-.026-.008-.052-.008-.078a1.5 1.5 0 1 1 1.5 1.5c-.026 0-.052-.007-.078-.008l-6.422 6.422.293.293a.997.997 0 0 0 1.049.232l10.342-3.761a2 2 0 0 0 1.316-1.88v-3.885L19 10.414 13.586 5l-1.999 1.999zm8.353 2.062-5-5 2.12-2.121 5 5z"/></svg>
      </span>
      <h3 class="lp-feature-title" style="margin: 0; font-size: 1.1rem; font-weight: 700;">Gradual Contracts</h3>
      <p class="lp-feature-description" style="margin: 0; font-size: 0.85rem; line-height: 1.5; color: var(--md-default-fg-color--light);">Express both runtime and compile-time constraints with unobtrusive contracts.</p>
    </div>

    <!-- Zero Overhead Errors -->
    <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1rem;">
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24"><path fill="url(#lp-icon-gradient)" d="M11 6h2v5h-2zm0 6h2v2h-2z"/><path fill="url(#lp-icon-gradient)" d="M20 2H4c-1.103 0-2 .897-2 2v18l5.333-4H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 14H6.667L4 18V4h16v12z"/></svg>
      </span>
      <h3 class="lp-feature-title" style="margin: 0; font-size: 1.1rem; font-weight: 700;">Zero Overhead Errors</h3>
      <p class="lp-feature-description" style="margin: 0; font-size: 0.85rem; line-height: 1.5; color: var(--md-default-fg-color--light);">Error handling that combines Result types with the ease of exceptions.</p>
    </div>

    <!-- Generic modules -->
    <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1rem;">
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24"><path fill="url(#lp-icon-gradient)" d="M22 8a.76.76 0 0 0 0-.21v-.08a.77.77 0 0 0-.07-.16.35.35 0 0 0-.05-.08l-.1-.13-.08-.06-.12-.09-9-5a1 1 0 0 0-1 0l-9 5-.09.07-.11.08a.41.41 0 0 0-.07.11.39.39 0 0 0-.08.1.59.59 0 0 0-.06.14.3.3 0 0 0 0 .1A.76.76 0 0 0 2 8v8a1 1 0 0 0 .52.87l9 5a.75.75 0 0 0 .13.06h.1a1.06 1.06 0 0 0 .5 0h.1l.14-.06 9-5A1 1 0 0 0 22 16V8zm-10 3.87L5.06 8l2.76-1.52 6.83 3.9zm0-7.72L18.94 8 16.7 9.25 9.87 5.34zM4 9.7l7 3.92v5.68l-7-3.89zm9 9.6v-5.68l3-1.68V15l2-1v-3.18l2-1.11v5.7z"/></svg>
      </span>
      <h3 class="lp-feature-title" style="margin: 0; font-size: 1.1rem; font-weight: 700;">Generic Modules</h3>
      <p class="lp-feature-description" style="margin: 0; font-size: 0.85rem; line-height: 1.5; color: var(--md-default-fg-color--light);">Superior simplicity and clarity for creating generic types.</p>
    </div>

    <!-- Runtime and compile reflection -->
    <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1rem;">
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24"><path fill="url(#lp-icon-gradient)" d="M10 11H7.101l.001-.009a4.956 4.956 0 0 1 .752-1.787 5.054 5.054 0 0 1 2.2-1.811c.302-.128.617-.226.938-.291a5.078 5.078 0 0 1 2.018 0 4.978 4.978 0 0 1 2.525 1.361l1.416-1.412a7.036 7.036 0 0 0-2.224-1.501 6.921 6.921 0 0 0-1.315-.408 7.079 7.079 0 0 0-2.819 0 6.94 6.94 0 0 0-1.316.409 7.04 7.04 0 0 0-3.08 2.534 6.978 6.978 0 0 0-1.054 2.505c-.028.135-.043.273-.063.41H2l4 4 4-4zm4 2h2.899l-.001.008a4.976 4.976 0 0 1-2.103 3.138 4.943 4.943 0 0 1-1.787.752 5.073 5.073 0 0 1-2.017 0 4.956 4.956 0 0 1-1.787-.752 5.072 5.072 0 0 1-.74-.61L7.05 16.95a7.032 7.032 0 0 0 2.225 1.5c.424.18.867.317 1.315.408a7.07 7.07 0 0 0 2.818 0 7.031 7.031 0 0 0 4.395-2.945 6.974 6.974 0 0 0 1.053-2.503c.027-.135.043-.273.063-.41H22l-4-4-4 4z"/></svg>
      </span>
      <h3 class="lp-feature-title" style="margin: 0; font-size: 1.1rem; font-weight: 700;">Reflection</h3>
      <p class="lp-feature-description" style="margin: 0; font-size: 0.85rem; line-height: 1.5; color: var(--md-default-fg-color--light);">Type introspection available both at compile time and runtime.</p>
    </div>

    <!-- Inline Assembly -->
    <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1rem;">
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24"><path fill="url(#lp-icon-gradient)" d="M8.293 6.293 2.586 12l5.707 5.707 1.414-1.414L5.414 12l4.293-4.293zm7.414 11.414L21.414 12l-5.707-5.707-1.414 1.414L18.586 12l-4.293 4.293z"/></svg>
      </span>
      <h3 class="lp-feature-title" style="margin: 0; font-size: 1.1rem; font-weight: 700;">Inline Assembly</h3>
      <p class="lp-feature-description" style="margin: 0; font-size: 0.85rem; line-height: 1.5; color: var(--md-default-fg-color--light);">Write asm as regular inline code without cryptic constraints.</p>
    </div>

    <!-- Debug with safety checks -->
    <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1rem;">
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24"><path fill="url(#lp-icon-gradient)" d="M6.787 7h10.426c-.108-.158-.201-.331-.318-.481l2.813-2.812-1.414-1.414-2.846 2.846a6.575 6.575 0 0 0-.723-.454 5.778 5.778 0 0 0-5.45 0c-.25.132-.488.287-.722.453L5.707 2.293 4.293 3.707l2.813 2.812c-.118.151-.21.323-.319.481zM5.756 9H2v2h2.307c-.065.495-.107.997-.107 1.5 0 .507.042 1.013.107 1.511H2v2h2.753c.013.039.021.08.034.118.188.555.421 1.093.695 1.6.044.081.095.155.141.234l-2.33 2.33 1.414 1.414 2.11-2.111a7.477 7.477 0 0 0 2.068 1.619c.479.253.982.449 1.496.58.204.052.411.085.618.118V16h2v5.914a6.23 6.23 0 0 0 .618-.118 6.812 6.812 0 0 0 1.496-.58c.465-.246.914-.55 1.333-.904.258-.218.5-.462.734-.716l2.111 2.111 1.414-1.414-2.33-2.33c.047-.08.098-.155.142-.236.273-.505.507-1.043.694-1.599.013-.039.021-.079.034-.118H22v-2h-2.308c.065-.499.107-1.004.107-1.511 0 -.503-.042-1.005-.106-1.5H22V9H5.756z"/></svg>
      </span>
      <h3 class="lp-feature-title" style="margin: 0; font-size: 1.1rem; font-weight: 700;">Safety Checks</h3>
      <p class="lp-feature-description" style="margin: 0; font-size: 0.85rem; line-height: 1.5; color: var(--md-default-fg-color--light);">Extensive runtime bounds and value checks to catch bugs early.</p>
    </div>

    <!-- Detailed stacktraces -->
    <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1rem;">
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24"><path fill="url(#lp-icon-gradient)" d="M21 5c0-1.103-.897-2-2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5zM5 19V5h14l.002 14H5z"/><path fill="url(#lp-icon-gradient)" d="M7 7h1.998v2H7zm4 0h6v2h-6zm-4 4h1.998v2H7zm4 0h6v2h-6zm-4 4h1.998v2H7zm4 0h6v2h-6z"/></svg>
      </span>
      <h3 class="lp-feature-title" style="margin: 0; font-size: 1.1rem; font-weight: 700;">Stacktraces</h3>
      <p class="lp-feature-description" style="margin: 0; font-size: 0.85rem; line-height: 1.5; color: var(--md-default-fg-color--light);">Detailed stacktraces out of the box for your debug builds.</p>
    </div>
  </div>
</div><hr style="width: 34rem; height: 2px; margin: 1.3rem auto; background-color: var(--md-default-fg-color--lightest); border: none;">

<div class="lp-max-w" style="text-align: center;">
  <h2 style="font-size: 2.25rem; font-weight: 700; color: var(--md-default-fg-color); margin-bottom: 0.5rem;"><span class="lp-gradient-text">Get</span> Started</h2>

  <div class="lp-get-started-grid" style="margin-top: 0;">
    <a href="getting-started/prebuilt-binaries/" class="lp-card">
      <div class="lp-card-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="96" height="96"><path fill="currentColor" d="M5 20h14v-2H5m14-9h-4V3H9v6H5l7 7z"/></svg>
      </div>
      <h3 class="lp-card-title">Download</h3>
      <p class="lp-card-description">Install the C3 compiler for Windows, Mac and Linux.</p>
    </a>

    <a href="getting-started/introduction/" class="lp-card">
      <div class="lp-card-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="96" height="96"><path fill="currentColor" d="M12 3 1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17z"/></svg>
      </div>
      <h3 class="lp-card-title">Learn</h3>
      <p class="lp-card-description">Check out the C3 manual to start programming with C3.</p>
    </a>

    <a href="get-involved/" class="lp-card">
      <div class="lp-card-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="96" height="96"><path fill="currentColor" d="M17 12V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v14l4-4h10a1 1 0 0 0 1-1m4-6h-2v9H6v2a1 1 0 0 0 1 1h11l4 4V7a1 1 0 0 0-1-1"/></svg>
      </div>
      <h3 class="lp-card-title">Engage</h3>
      <p class="lp-card-description">Help us improve C3 by being a part of the community.</p>
    </a>
  </div>
</div>



<script>
	function setupDownloads() {
		var mainBtn = document.getElementById("main-download-btn");
		if (!mainBtn) return;

		var os = "Linux";
		var userAgent = window.navigator.userAgent;
		if (userAgent.indexOf("Win") !== -1) os = "Windows";
		if (userAgent.indexOf("Mac") !== -1) os = "macOS";

		var links = {
			Windows: "https://github.com/c3lang/c3c/releases/latest/download/c3-windows.zip",
			macOS:   "https://github.com/c3lang/c3c/releases/latest/download/c3-macos.zip",
			Linux:   "https://github.com/c3lang/c3c/releases/latest/download/c3-linux-static.tar.gz",
		};

		document.getElementById("os-name").innerText = os;
		mainBtn.href = links[os];
	}

	// MkDocs Material specific event for instant navigation
	if (typeof document$ !== "undefined") {
		document$.subscribe(function () {
			setupDownloads();
		});
	} else {
		window.addEventListener("DOMContentLoaded", setupDownloads);
	}
</script>
