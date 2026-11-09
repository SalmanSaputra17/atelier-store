"use client";

import Link from "next/link";
import { useRef } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";

type NavItem = { label: string; href: string };

// Native <dialog> gives focus trapping, Escape-to-close and an inert page for free.
export function MobileNav({ items }: { items: NavItem[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        className="-ml-2 inline-flex size-10 items-center justify-center lg:hidden"
        aria-label="Open menu"
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
      >
        <MenuIcon />
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Menu"
        className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-full max-w-sm bg-canvas p-0 text-ink backdrop:bg-ink/40"
        onClick={(event) => {
          // Clicks on the backdrop land on the dialog element itself.
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-header items-center justify-between border-b px-gutter">
            <span className="label-caps">Menu</span>
            <button
              type="button"
              className="-mr-2 inline-flex size-10 items-center justify-center"
              aria-label="Close menu"
              onClick={close}
            >
              <CloseIcon />
            </button>
          </div>

          <nav aria-label="Main" className="flex-1 overflow-y-auto px-gutter py-6">
            <ul className="flex flex-col">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block py-3 text-heading"
                    onClick={close}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-4 border-t px-gutter py-6">
            <Link href="/account" className="link-quiet label-caps" onClick={close}>
              Sign in
            </Link>
            <Link href="/client-services" className="link-quiet label-caps" onClick={close}>
              Client services
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
