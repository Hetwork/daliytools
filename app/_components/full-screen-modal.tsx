import { useEffect } from "react";

type FullScreenModalProps = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export default function FullScreenModal({ title, onClose, children }: FullScreenModalProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousOverflowX = document.body.style.overflowX;
    document.body.style.overflow = "hidden";
    document.body.style.overflowX = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overflowX = previousOverflowX;
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(15, 14, 13, 0.45)",
        zIndex: 50,
        display: "flex",
        alignItems: "stretch",
        justifyContent: "stretch",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          background: "#f3f2f2",
          border: "none",
          borderRadius: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(32,30,29,0.12)",
            padding: "10px 20px 8px",
            background: "#f3f2f2",
            flexShrink: 0,
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.4, margin: 0 }}>
            {title}
          </p>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid #201e1d",
              color: "#201e1d",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "4px 8px",
              cursor: "pointer",
            }}
          >
            Exit Full Screen
          </button>
        </div>
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
