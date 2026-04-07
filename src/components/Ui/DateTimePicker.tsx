import { useState, useEffect } from "react";
import { FaCalendarAlt, FaClock } from "react-icons/fa";

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = [
  { value: 1, label: "Jan" }, { value: 2, label: "Feb" }, { value: 3, label: "Mar" },
  { value: 4, label: "Apr" }, { value: 5, label: "May" }, { value: 6, label: "Jun" },
  { value: 7, label: "Jul" }, { value: 8, label: "Aug" }, { value: 9, label: "Sep" },
  { value: 10, label: "Oct" }, { value: 11, label: "Nov" }, { value: 12, label: "Dec" },
];
const YEARS = Array.from({ length: 3 }, (_, i) => new Date().getFullYear() + i);
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES_OPTIONS = ["00", "15", "30", "45"];

const selectClass =
  "border border-gray-200 dark:border-gray-600 rounded-xl px-2 py-2.5 text-sm text-gray-900 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:border-[#D4AF37] text-center w-full cursor-pointer";

interface DateTimePickerProps {
  onDateChange?: (date: string) => void;
  onTimeChange?: (time: string) => void;
  showDate?: boolean;
  showTime?: boolean;
  accentColor?: string;
  /** If you want controlled values */
  initialDate?: { day: number; month: number; year: number };
  initialTime?: { hour: number; minute: string; period: "AM" | "PM" };
  compact?: boolean;
  dateLabel?: string;
  timeLabel?: string;
}

const DateTimePicker = ({
  onDateChange,
  onTimeChange,
  showDate = true,
  showTime = true,
  accentColor = "#D4AF37",
  initialDate,
  initialTime,
  compact = false,
  dateLabel = "Select Date",
  timeLabel = "Select Time",
}: DateTimePickerProps) => {
  const now = new Date();
  const [day, setDay] = useState(initialDate?.day || now.getDate());
  const [month, setMonth] = useState(initialDate?.month || now.getMonth() + 1);
  const [year, setYear] = useState(initialDate?.year || now.getFullYear());
  const [hour, setHour] = useState(initialTime?.hour || 10);
  const [minute, setMinute] = useState(initialTime?.minute || "00");
  const [period, setPeriod] = useState<"AM" | "PM">(initialTime?.period || "AM");

  const handleDateUpdate = (d: number, m: number, y: number) => {
    const formattedDate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    onDateChange?.(formattedDate);
  };

  const handleTimeUpdate = (h: number, min: string, p: string) => {
    onTimeChange?.(`${h}:${min} ${p}`);
  };

  useEffect(() => {
    handleDateUpdate(day, month, year);
    handleTimeUpdate(hour, minute, period);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`space-y-${compact ? "3" : "4"}`}>
      {showDate && (
        <div>
          <label className={`${compact ? "text-xs" : "text-sm"} font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5`}>
            <FaCalendarAlt className="text-xs" style={{ color: accentColor }} />
            {dateLabel}
          </label>
          <div className="grid grid-cols-3 gap-2 mt-1">
            <select
              value={day}
              onChange={(e) => {
                const d = Number(e.target.value);
                setDay(d);
                handleDateUpdate(d, month, year);
              }}
              className={selectClass}
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select
              value={month}
              onChange={(e) => {
                const m = Number(e.target.value);
                setMonth(m);
                handleDateUpdate(day, m, year);
              }}
              className={selectClass}
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => {
                const y = Number(e.target.value);
                setYear(y);
                handleDateUpdate(day, month, y);
              }}
              className={selectClass}
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {showTime && (
        <div>
          <label className={`${compact ? "text-xs" : "text-sm"} font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5`}>
            <FaClock className="text-xs" style={{ color: accentColor }} />
            {timeLabel}
          </label>
          <div className="grid grid-cols-3 gap-2 mt-1">
            <select
              value={hour}
              onChange={(e) => {
                const h = Number(e.target.value);
                setHour(h);
                handleTimeUpdate(h, minute, period);
              }}
              className={selectClass}
            >
              {HOURS.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            <select
              value={minute}
              onChange={(e) => {
                setMinute(e.target.value);
                handleTimeUpdate(hour, e.target.value, period);
              }}
              className={selectClass}
            >
              {MINUTES_OPTIONS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select
              value={period}
              onChange={(e) => {
                const p = e.target.value as "AM" | "PM";
                setPeriod(p);
                handleTimeUpdate(hour, minute, p);
              }}
              className={`${selectClass} font-bold`}
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;
