import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="square"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </Icon>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </Icon>
  );
}

export function BagIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 8h15l-1 13h-13z" />
      <path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8" />
    </Icon>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 7h18M3 12h18M3 17h18" />
    </Icon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m5 5 14 14M19 5 5 19" />
    </Icon>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m15 5-7 7 7 7" />
    </Icon>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m9 5 7 7-7 7" />
    </Icon>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 5v14M15 5v14" />
    </Icon>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 4.5v15L19 12z" />
    </Icon>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </Icon>
  );
}

// Service icons (homepage "Client care" cards).
export function DeliveryIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2.5 6.5h11v10h-11zM13.5 10h4l3 3v3.5h-7" />
      <circle cx="6.5" cy="17.5" r="1.75" />
      <circle cx="16.5" cy="17.5" r="1.75" />
    </Icon>
  );
}

export function GiftIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 8.5h17v4h-17zM5 12.5h14v8H5zM12 8.5v12" />
      <path d="M12 8.5c-1.5-3.5-5-4-5-1.75S10 8.5 12 8.5c2 0 5 .5 5-1.75s-3.5-1.75-5 1.75" />
    </Icon>
  );
}

export function ConversationIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 4.5h12v8h-6l-3.5 3v-3H3.5z" />
      <path d="M15.5 8.5h5v8h-2.5v3l-3.5-3h-4.5v-1.5" />
    </Icon>
  );
}

export function ScissorsIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="6" cy="6.5" r="2.5" />
      <circle cx="6" cy="17.5" r="2.5" />
      <path d="M8.2 7.7 20 16.5M8.2 16.3 20 7.5" />
    </Icon>
  );
}
