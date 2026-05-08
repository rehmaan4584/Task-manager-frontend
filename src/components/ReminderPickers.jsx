import React, {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function pad2(n) {
  return String(n).padStart(2, "0");
}

/** @param {number} year @param {number} month 0-11 */
function buildCalendarCells(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const daysInMonth = last.getDate();
  const mondayFirst = (d) => (d === 0 ? 6 : d - 1);
  const pad = mondayFirst(first.getDay());
  const cells = [];
  for (let i = 0; i < pad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

function localDateParts(d) {
  return {
    y: d.getFullYear(),
    m: d.getMonth(),
    day: d.getDate(),
  };
}

function toYyyyMmDd(year, monthZero, day) {
  return `${year}-${pad2(monthZero + 1)}-${pad2(day)}`;
}

function parseYyyyMmDd(s) {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split("-").map(Number);
  return { y, m: m - 1, day: d };
}

function todayYyyyMmDd() {
  const t = new Date();
  return toYyyyMmDd(t.getFullYear(), t.getMonth(), t.getDate());
}

function to24h(h12, period) {
  if (period === "AM") return h12 === 12 ? 0 : h12;
  return h12 === 12 ? 12 : h12 + 12;
}

function from24h(h24) {
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return { h12, period };
}

function parseHhMm(s) {
  if (!s || !/^\d{1,2}:\d{2}$/.test(s)) return { h: 9, m: 0, period: "AM" };
  const [hs, ms] = s.split(":");
  const h24 = Math.min(23, Math.max(0, parseInt(hs, 10)));
  const minute = Math.min(59, Math.max(0, parseInt(ms, 10)));
  const { h12, period } = from24h(h24);
  return { h: h12, m: minute, period };
}

function toHhMm(h12, minute, period) {
  const h24 = to24h(h12, period);
  return `${pad2(h24)}:${pad2(minute)}`;
}

/** Click outside when the popover is portaled to document.body (anchor + panel are siblings in logic only). */
function useClickOutsideTwo(anchorRef, panelRef, open, onClose) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      const t = e.target;
      if (anchorRef.current?.contains(t) || panelRef.current?.contains(t)) return;
      onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose, anchorRef, panelRef]);
}

/** Same rules for calendar + time: prefer below anchor; flip above if it would overflow the viewport. */
function usePopoverFixedPosition(anchorRef, panelRef, isOpen, ...layoutDeps) {
  const [fixedPos, setFixedPos] = useState({ top: 0, left: 0, width: 384 });

  useLayoutEffect(() => {
    if (!isOpen) return;
    const margin = 8;
    const gap = 8;
    const maxW = 384;

    const update = () => {
      const anchor = anchorRef.current;
      const panel = panelRef.current;
      if (!anchor) return;
      const r = anchor.getBoundingClientRect();
      const w = Math.min(maxW, window.innerWidth - 2 * margin);
      let left = Math.min(Math.max(margin, r.left), window.innerWidth - margin - w);
      let top = r.bottom + gap;
      const h = panel?.offsetHeight ?? 0;
      if (h > 0 && top + h > window.innerHeight - margin) {
        top = Math.max(margin, r.top - gap - h);
      }
      setFixedPos({ top, left, width: w });
    };

    update();
    const raf = requestAnimationFrame(() => update());
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [isOpen, ...layoutDeps]);

  return fixedPos;
}

export function DatePickerField({
  id,
  value,
  onChange,
  minDate,
  isOpen,
  onOpen,
  onClose,
}) {
  const baseId = useId();
  const panelId = `${baseId}-date-panel`;
  const wrapRef = useRef(null);
  const panelRef = useRef(null);
  const min = minDate || todayYyyyMmDd();

  const parsed = parseYyyyMmDd(value);
  const initialView = parsed
    ? new Date(parsed.y, parsed.m, 1)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const [view, setView] = useState(initialView);

  useEffect(() => {
    if (!isOpen) return;
    const p = parseYyyyMmDd(value);
    if (p) {
      setView(new Date(p.y, p.m, 1));
    } else {
      const t = new Date();
      setView(new Date(t.getFullYear(), t.getMonth(), 1));
    }
  }, [isOpen, value]);

  useClickOutsideTwo(wrapRef, panelRef, isOpen, onClose);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const { y: vy, m: vm } = localDateParts(view);
  const cells = buildCalendarCells(vy, vm);
  const rows = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  const label = value
    ? new Date(value + "T12:00:00").toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const selectDay = (day) => {
    if (!day) return;
    const picked = toYyyyMmDd(vy, vm, day);
    if (picked < min) return;
    onChange(picked);
    onClose();
  };

  const fixedPos = usePopoverFixedPosition(
    wrapRef,
    panelRef,
    isOpen,
    vy,
    vm,
    cells.length,
  );

  const calendarPanel = isOpen && (
    <div
      ref={panelRef}
      id={panelId}
      role="dialog"
      aria-modal="true"
      aria-label="Choose reminder date"
      style={{
        position: "fixed",
        top: fixedPos.top,
        left: fixedPos.left,
        width: fixedPos.width,
        zIndex: 100,
      }}
      className="overflow-visible rounded-2xl border border-zinc-700/80 bg-zinc-900 p-4 shadow-xl shadow-black/40"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <button
          type="button"
          className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/5 hover:text-zinc-100"
          aria-label="Previous month"
          onClick={() => setView(new Date(vy, vm - 1, 1))}
        >
          ‹
        </button>
        <p className="text-sm font-semibold text-zinc-100">
          {view.toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          })}
        </p>
        <button
          type="button"
          className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/5 hover:text-zinc-100"
          aria-label="Next month"
          onClick={() => setView(new Date(vy, vm + 1, 1))}
        >
          ›
        </button>
      </div>
      <div className="w-full">
        <div className="grid grid-cols-7 gap-x-1.5 gap-y-0 text-center text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
          {WEEKDAYS.map((d) => (
            <div key={d} className="flex h-6 items-center justify-center">
              {d}
            </div>
          ))}
        </div>
        <div className="mt-1.5 space-y-0.5">
          {rows.map((row, ri) => (
            <div key={ri} className="grid grid-cols-7 gap-x-1.5 gap-y-0">
              {row.map((cell, ci) => {
                if (cell === null) {
                  return (
                    <div key={`e-${ci}`} className="h-8 w-full min-w-0" />
                  );
                }
                const picked = toYyyyMmDd(vy, vm, cell);
                const disabled = picked < min;
                const isToday = picked === todayYyyyMmDd();
                const isSelected = value === picked;
                return (
                  <button
                    key={cell}
                    type="button"
                    disabled={disabled}
                    onClick={() => selectDay(cell)}
                    className={[
                      "flex h-8 w-full min-w-0 items-center justify-center rounded-lg text-sm font-medium transition",
                      disabled
                        ? "cursor-not-allowed text-zinc-600"
                        : "text-zinc-200 hover:bg-amber-500/15 hover:text-amber-100",
                      isToday && !disabled ? "ring-1 ring-amber-500/40" : "",
                      isSelected
                        ? "bg-amber-500 text-zinc-950 hover:bg-amber-400 hover:text-zinc-950"
                        : "",
                    ].join(" ")}
                  >
                    {cell}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        id={id}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => (isOpen ? onClose() : onOpen())}
        className="input-premium flex w-full items-center justify-between gap-2 text-left"
      >
        <span className={value ? "text-zinc-100" : "text-zinc-500"}>
          {label ?? "Pick a date"}
        </span>
        <span className="text-zinc-500" aria-hidden>
          <svg
            className="h-5 w-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5"
            />
          </svg>
        </span>
      </button>

      {typeof document !== "undefined" &&
        calendarPanel &&
        createPortal(calendarPanel, document.body)}
    </div>
  );
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

export function TimePickerField({
  id,
  value,
  onChange,
  isOpen,
  onOpen,
  onClose,
}) {
  const baseId = useId();
  const panelId = `${baseId}-time-panel`;
  const wrapRef = useRef(null);
  const panelRef = useRef(null);

  const [draft, setDraft] = useState(() => {
    const p = parseHhMm(value);
    return { h: p.h, m: p.m, period: p.period };
  });

  useEffect(() => {
    const p = parseHhMm(value);
    setDraft({ h: p.h, m: p.m, period: p.period });
  }, [value, isOpen]);

  useClickOutsideTwo(wrapRef, panelRef, isOpen, onClose);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const fixedPos = usePopoverFixedPosition(wrapRef, panelRef, isOpen);

  const label = value
    ? (() => {
        const [hh, mm] = value.split(":");
        const d = new Date(2000, 0, 1, parseInt(hh, 10), parseInt(mm, 10));
        return d.toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "2-digit",
        });
      })()
    : null;

  const apply = () => {
    onChange(toHhMm(draft.h, draft.m, draft.period));
    onClose();
  };

  const timePanel = isOpen && (
    <div
      ref={panelRef}
      id={panelId}
      role="dialog"
      aria-modal="true"
      aria-label="Choose reminder time"
      style={{
        position: "fixed",
        top: fixedPos.top,
        left: fixedPos.left,
        width: fixedPos.width,
        zIndex: 100,
      }}
      className="overflow-visible rounded-2xl border border-zinc-700/80 bg-zinc-900 p-4 shadow-xl shadow-black/40"
    >
      <div className="flex gap-2">
        <div className="min-w-0 flex-1">
          <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Hour
          </p>
          <div className="max-h-40 overflow-y-auto rounded-xl border border-zinc-700/60 bg-zinc-950/50 p-1">
            {HOURS.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setDraft((d) => ({ ...d, h }))}
                className={[
                  "flex w-full items-center justify-center rounded-lg py-2 text-sm font-medium transition",
                  draft.h === h
                    ? "bg-amber-500 text-zinc-950"
                    : "text-zinc-300 hover:bg-white/5",
                ].join(" ")}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Min
          </p>
          <div className="max-h-40 overflow-y-auto rounded-xl border border-zinc-700/60 bg-zinc-950/50 p-1">
            {MINUTES.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setDraft((d) => ({ ...d, m }))}
                className={[
                  "flex w-full items-center justify-center rounded-lg py-1.5 text-sm font-medium tabular-nums transition",
                  draft.m === m
                    ? "bg-amber-500 text-zinc-950"
                    : "text-zinc-300 hover:bg-white/5",
                ].join(" ")}
              >
                {pad2(m)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex w-14 shrink-0 flex-col justify-end gap-1 pb-1">
          <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            &nbsp;
          </p>
          {["AM", "PM"].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setDraft((d) => ({ ...d, period: p }))}
              className={[
                "rounded-lg py-2 text-xs font-bold transition",
                draft.period === p
                  ? "bg-amber-500 text-zinc-950"
                  : "border border-zinc-700/80 bg-zinc-950/50 text-zinc-300 hover:bg-white/5",
              ].join(" ")}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={apply}
        className="mt-4 w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 text-sm font-semibold text-zinc-950"
      >
        Done
      </button>
    </div>
  );

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        id={id}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => (isOpen ? onClose() : onOpen())}
        className="input-premium flex w-full items-center justify-between gap-2 text-left"
      >
        <span className={value ? "text-zinc-100" : "text-zinc-500"}>
          {label ?? "Pick a time"}
        </span>
        <span className="text-zinc-500" aria-hidden>
          <svg
            className="h-5 w-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>
      </button>

      {typeof document !== "undefined" &&
        timePanel &&
        createPortal(timePanel, document.body)}
    </div>
  );
}
