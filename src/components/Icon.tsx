export function Icon({
  name,
  className = "",
}: {
  name: "bag" | "menu" | "close" | "search" | "plus" | "minus";
  className?: string;
}) {
  const paths = {
    bag: (
      <>
        <path d="M5 7h14l1 14H4L5 7Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </>
    ),
    menu: (
      <>
        <path d="M3 8h18M3 16h18" />
      </>
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    plus: <path d="M4 12h16M12 4v16" />,
    minus: <path d="M4 12h16" />,
  };
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      {paths[name]}
    </svg>
  );
}
