/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";

// 임시 데이터 (나중에 API로 대체)
const readingRecords = [
  {
    date: new Date(2025, 9, 5),
    contentId: "cmg918wo70002w5xnfvbkfhbk",
    contentTitle: "하츄핑의 모험",
    contentImage: "uploads/1759389368571-___________.webp",
  },
  {
    date: new Date(2025, 9, 10),
    contentId: "cmg918wo70002w5xnfvbkfhbk",
    contentTitle: "허거덩거덩스",
    contentImage: "uploads/1759389368571-___________.webp",
  },
];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // 특정 날짜에 기록이 있는지 확인
  const hasRecordOnDate = (date: Date) => {
    return readingRecords.some((record) => isSameDay(record.date, date));
  };

  // 특정 날짜의 기록 가져오기
  const getRecordsForDate = (date: Date) => {
    return readingRecords.filter((record) => isSameDay(record.date, date));
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-6xl px-4">
       

        <div className="flex justify-center">
          {/* 캘린더 */}
          <div className="w-full max-w-4xl">
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <Calendar
                onChange={(value) => setSelectedDate(value as Date)}
                value={selectedDate}
                locale="ko-KR"
                formatDay={(locale, date) => format(date, "d")}
                formatMonthYear={(locale, date) =>
                  format(date, "yyyy년 M월", { locale: ko })
                }
                tileContent={({ date, view }) => {
                  if (view === "month") {
                    const records = getRecordsForDate(date);
                    if (records.length > 0) {
                      const record = records[0];
                      if (!record) return null;
                      
                      return (
                        <div className="absolute inset-0 overflow-hidden rounded-lg">
                          {record.contentImage ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? ""}/${record.contentImage}`}
                              alt={record.contentTitle}
                              className="h-full w-full object-cover opacity-80"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 text-2xl opacity-80">
                              📚
                            </div>
                          )}
                          {records.length > 1 && (
                            <div className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-xs font-medium text-white">
                              +{records.length - 1}
                            </div>
                          )}
                        </div>
                      );
                    }
                  }
                  return null;
                }}
                tileClassName={({ date, view }) => {
                  if (view === "month" && hasRecordOnDate(date)) {
                    return "has-record";
                  }
                  return null;
                }}
                className="reading-calendar"
              />
            </div>
          </div>

        </div>

        
      </div>
    </main>
  );
}

