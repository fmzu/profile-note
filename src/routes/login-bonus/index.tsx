import { createFileRoute } from "@tanstack/react-router"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getWeekBaseMondayIso } from "@/lib/login-bonus-date"
import { useLoginBonusStore } from "@/store/login-bonus-context"
import type { LoginBonusCalendarDay } from "@/types/types"

const weekdayMessages = [
  "ログインおつかれさま！",
  "今日も一日がんばろう！",
  "深呼吸してスタートしよう。",
]

const weekendMessages = [
  "ゆっくり休んでね。",
  "あたたかい飲み物を用意してほっとしよう。",
  "また一週間がんばろう。",
]

const completionMessages = [
  "一週間おつかれさま！",
  "ぜんぶログインできたね！",
  "💮でいっぱいの一週間だよ。",
]

const manualCompletionMessages = [
  "今週もよくがんばった！",
  "ペースは自由で大丈夫だよ。",
  "その調子で自分をねぎらおう。",
]

const encouragementMessages = [
  "あと少しでご褒美だよ。",
  "無理せずマイペースで進もう。",
  "自分のペースを大切にね。",
]

const weekdayHeaders = ["日", "月", "火", "水", "木", "金", "土"]

export const Route = createFileRoute("/login-bonus/")({
  component: LoginBonusPage,
})

type MessageContent = {
  heading: string
  body: string
}

function pickMessage(seed: string, options: string[]): string {
  if (options.length === 0) {
    return ""
  }
  const codeUnit = seed.charCodeAt(seed.length - 1)
  const index = codeUnit % options.length
  return options[index]
}

function buildMessage(props: {
  currentDateIso: string
  isWeekend: boolean
  isWorkingDay: boolean
  claimState: "pending" | "completed" | "manual"
  bonusText: string
  loggedDayCount: number
  workingDayCount: number
  missingWorkingDays: string[]
}): MessageContent {
  const trimmedBonus = props.bonusText.trim()
  if (props.claimState === "completed") {
    const heading = pickMessage(props.currentDateIso, completionMessages)
    let body = "ログインボーナスを受け取ったよ。"
    if (trimmedBonus !== "") {
      body = `ログインボーナスゲット！「${trimmedBonus}」`
    }
    return { heading, body }
  }
  if (props.claimState === "manual") {
    const heading = pickMessage(props.currentDateIso, manualCompletionMessages)
    if (trimmedBonus === "") {
      return {
        heading,
        body: "ログインボーナスゲット！今週のログインボーナスは今日のあなたが決めよう！",
      }
    }
    return {
      heading,
      body: `やさしくご褒美タイム。「${trimmedBonus}」でリフレッシュしよう。`,
    }
  }
  if (props.isWeekend) {
    const heading = pickMessage(props.currentDateIso, weekendMessages)
    return {
      heading,
      body: "平日はカレンダーに💮がふえていくよ。",
    }
  }
  if (!props.isWorkingDay) {
    return {
      heading: "おつかれさま！",
      body: "次の平日もやさしくログインしてね。",
    }
  }
  if (props.missingWorkingDays.length === 0 && props.workingDayCount > 0) {
    return {
      heading: "あとすこしでご褒美！",
      body: "今日もログインできたら金曜日にご褒美を受け取ろう。",
    }
  }
  const heading = pickMessage(props.currentDateIso, weekdayMessages)
  let remainingText = ""
  if (props.workingDayCount > 0) {
    const remaining = props.workingDayCount - props.loggedDayCount
    if (remaining > 0) {
      remainingText = `ご褒美まではあと${remaining}日。`
    }
  }
  const encouragement = pickMessage(props.currentDateIso, encouragementMessages)
  const bodyParts: string[] = []
  if (remainingText !== "") {
    bodyParts.push(remainingText)
  }
  bodyParts.push(encouragement)
  return {
    heading,
    body: bodyParts.join(" "),
  }
}

function LoginBonusPage() {
  const store = useLoginBonusStore()

  React.useEffect(() => {
    store.markTodayLogin()
  }, [store.markTodayLogin])

  const [manualPromptDismissed, setManualPromptDismissed] = React.useState(false)

  React.useEffect(() => {
    setManualPromptDismissed(false)
  }, [store.currentWeek.id, store.currentDateIso])

  let todayInfo = undefined as LoginBonusCalendarDay | undefined
  for (const day of store.calendarDays) {
    if (day.date === store.currentDateIso) {
      todayInfo = day
      break
    }
  }
  const isWeekend = todayInfo ? todayInfo.isWeekend : false
  const isWorkingDay = todayInfo ? todayInfo.isWorkingDay : false

  const message = buildMessage({
    currentDateIso: store.currentDateIso,
    isWeekend,
    isWorkingDay,
    claimState: store.currentWeek.claimState,
    bonusText: store.currentWeek.bonusText,
    loggedDayCount: store.currentLoggedDayCount,
    workingDayCount: store.currentWorkingDayCount,
    missingWorkingDays: store.currentMissingWorkingDays,
  })

  const trimmedBonus = store.selectedWeek.bonusText.trim()
  const [isEditing, setIsEditing] = React.useState(trimmedBonus === "" && store.canEditSelectedWeekBonus)
  const [draft, setDraft] = React.useState(store.selectedWeek.bonusText)

  React.useEffect(() => {
    setDraft(store.selectedWeek.bonusText)
  }, [store.selectedWeek.id, store.selectedWeek.bonusText])

  React.useEffect(() => {
    if (store.selectedWeek.bonusText.trim() === "" && store.canEditSelectedWeekBonus) {
      setIsEditing(true)
    }
  }, [store.selectedWeek.id, store.selectedWeek.bonusText, store.canEditSelectedWeekBonus])

  function handleBonusSave() {
    store.updateSelectedWeekBonusText(draft.trim())
    setIsEditing(false)
  }

  function handleBonusCancel() {
    setDraft(store.selectedWeek.bonusText)
    setIsEditing(false)
  }

  const progressPercentage =
    store.currentWorkingDayCount === 0
      ? 0
      : Math.round((store.currentLoggedDayCount / store.currentWorkingDayCount) * 100)

  const bonusIsEditable = store.canEditSelectedWeekBonus
  const shouldShowManualPrompt = store.shouldShowManualClaimPrompt && !manualPromptDismissed

  function handleWeekSelectFromDate(isoDate: string) {
    const weekId = getWeekBaseMondayIso(isoDate)
    store.selectWeek(weekId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-sky-50 to-indigo-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <header className="rounded-3xl border border-white/60 bg-white/80 p-6 text-center shadow-xl shadow-sky-100">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-500 sm:text-sm">Self-Care Bonus</p>
          <h1 className="mt-3 text-2xl font-semibold text-slate-800 sm:text-3xl">{"自分で決めるログインボーナス"}</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {"平日のログインで💮を集めて、金曜日（祝日の場合は前日）に自分で決めたご褒美メッセージを受け取ろう。"}
          </p>
          <p className="mt-2 text-xs text-slate-500">{"週の開始は祝日をのぞいた最初の平日から。三か月先以降はまた後で設定しようね。"}</p>
        </header>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-3xl bg-gradient-to-br from-sky-100/70 via-white to-white p-6 shadow-lg shadow-sky-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500 sm:text-xs">Today</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-800">{message.heading}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{message.body}</p>
              </div>
              <div className="rounded-2xl bg-white/80 px-4 py-3 text-center shadow-inner shadow-white/60">
                <p className="text-xs font-semibold text-slate-500">{"進捗"}</p>
                <p className="mt-1 text-2xl font-semibold text-slate-800">{`${store.currentLoggedDayCount}/${store.currentWorkingDayCount}`}</p>
                <p className="text-[11px] text-slate-500">{"平日"}</p>
              </div>
            </div>
            <div className="mt-5 h-2 rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-indigo-400 transition-[width]"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-slate-500">{store.currentWeek.calendarLabel}</p>

            {shouldShowManualPrompt ? (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-inner">
                <p className="text-sm font-semibold text-slate-800">{"ログインボーナスをゲットしますか？"}</p>
                <p className="mt-2 text-xs text-slate-600">
                  {"土日はカウントしないから、自分にやさしくご褒美をあげるか決めてね。"}
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Button className="flex-1 rounded-full bg-indigo-500 text-white hover:bg-indigo-400" onClick={store.requestManualClaim}>
                    {"ゲットする"}
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-1 rounded-full text-slate-500 hover:text-slate-700"
                    onClick={() => setManualPromptDismissed(true)}
                  >
                    {"またあとで"}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-lg shadow-slate-100">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">{"Weekly Bonus"}</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-800">{"ログインボーナスの設定"}</h2>
            <p className="text-xs text-slate-500">{store.selectedWeek.calendarLabel}</p>
            {isEditing ? (
              <>
                <Textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="例: 金曜の夜はチーズケーキでお祝い🎂"
                  className="mt-4 min-h-28 rounded-2xl border-rose-200 bg-rose-50/70"
                  disabled={!bonusIsEditable}
                />
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Button
                    className="flex-1 rounded-full bg-rose-500 text-white hover:bg-rose-400 disabled:bg-slate-300"
                    onClick={handleBonusSave}
                    disabled={!bonusIsEditable}
                  >
                    {"保存する"}
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-1 rounded-full text-slate-500 hover:text-slate-700"
                    onClick={handleBonusCancel}
                  >
                    {"やめる"}
                  </Button>
                </div>
                {!bonusIsEditable ? (
                  <p className="mt-2 text-xs text-rose-500">
                    {"付与日（週の最終平日）は編集できません。次の週で調整しようね。"}
                  </p>
                ) : null}
              </>
            ) : (
              <>
                <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <p className="text-sm leading-relaxed text-slate-700">
                    {trimmedBonus === "" ? "まだ設定されていません。" : trimmedBonus}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="mt-4 w-full rounded-full border-rose-200 text-rose-500 hover:bg-rose-50"
                  onClick={() => setIsEditing(true)}
                  disabled={!bonusIsEditable}
                >
                  {bonusIsEditable ? "編集する" : "この週は編集できません"}
                </Button>
              </>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-white/60 bg-white/90 p-6 shadow-xl shadow-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">{"Monthly Calendar"}</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-800">{"今月のログイン記録"}</h2>
              <p className="text-xs text-slate-500">
                {"💮 はログイン済み。祝日と土日は自動でスキップされます。"}
              </p>
              <p className="text-xs text-slate-400">
                {"その週の金曜日（平日）をタップすると、その週のログインボーナスを選べます。"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="rounded-full bg-rose-50/80 px-4 py-2 text-xs font-semibold text-rose-600 shadow-inner">
                {store.monthLabel}
              </div>
              <div className="rounded-full bg-sky-50/80 px-4 py-2 text-xs font-semibold text-sky-700 shadow-inner">
                {store.selectedWeek.calendarLabel}
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
              {weekdayHeaders.map((label, index) => {
                let headerClass = "text-slate-400"
                if (index === 0) {
                  headerClass = "text-rose-500"
                } else if (index === 6) {
                  headerClass = "text-sky-600"
                }
                return (
                  <div key={label} className={`py-1 ${headerClass}`}>
                    {label}
                  </div>
                )
              })}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-2 sm:gap-3">
              {store.calendarDays.map((day) => {
                const baseClass =
                  "rounded-2xl border p-2 text-center shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:p-3"
                let borderColor = "border-slate-100"
                if (day.isToday) {
                  borderColor = "border-indigo-400"
                } else if (day.isHoliday) {
                  borderColor = "border-rose-200"
                } else if (day.isActiveWeekDay) {
                  borderColor = "border-sky-200"
                }
                const backgroundClass = day.isWorkingDay ? "bg-sky-50/80" : "bg-slate-50/70"
                const opacityClass = day.isCurrentMonth ? "" : "opacity-50"
                const stamp = day.isWorkingDay ? (day.isLogged ? "💮" : "・") : "☁️"
                let labelColor = "text-slate-500"
                if (day.weekdayIndex === 0) {
                  labelColor = "text-rose-500"
                } else if (day.weekdayIndex === 6) {
                  labelColor = "text-sky-600"
                }
                const isSelectableFriday = day.weekdayIndex === 5 && day.isWorkingDay
                if (isSelectableFriday) {
                  return (
                    <button
                      key={day.date}
                      type="button"
                      className={`${baseClass} ${borderColor} ${backgroundClass} ${opacityClass} cursor-pointer`}
                      onClick={() => handleWeekSelectFromDate(day.date)}
                    >
                      <p className={`text-xs font-semibold ${labelColor}`}>
                        {day.label}
                        <span className="ml-1 text-[11px] text-slate-400">{day.weekdayLabel}</span>
                      </p>
                      <p className="mt-1 text-2xl sm:mt-2">{stamp}</p>
                      <p className="mt-1 text-[10px] text-rose-500 sm:mt-2">{"タップして設定"}</p>
                    </button>
                  )
                }
                return (
                  <div key={day.date} className={`${baseClass} ${borderColor} ${backgroundClass} ${opacityClass}`}>
                    <p className={`text-xs font-semibold ${labelColor}`}>
                      {day.label}
                      <span className="ml-1 text-[11px] text-slate-400">{day.weekdayLabel}</span>
                    </p>
                    <p className="mt-1 text-2xl sm:mt-2">{stamp}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
