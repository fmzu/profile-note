/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router"
import type * as React from "react"
import { CustomErrorComponent } from "@/components/custom-error-component"
import { NotFoundComponent } from "@/components/not-found-component"
import { ProfileProvider } from "@/store/profile-context"
import appCss from "@/styles/app.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        name: "description",
        content:
          "MyProfileNote は、好きなカテゴリを選んでプロフィールカードを作り、PNGとして保存できるアプリです。",
      },
      {
        property: "og:title",
        content: "MyProfileNote",
      },
      {
        property: "og:description",
        content:
          "好きなカテゴリを最大4つ選んで、かわいいプロフィールカードを作成・保存しましょう。",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  errorComponent: CustomErrorComponent,
  notFoundComponent: () => <NotFoundComponent />,
  shellComponent: RootDocument,
})

type Props = { children: React.ReactNode }

function RootDocument(props: Props) {
  return (
    <html lang="ja">
      <head>
        <HeadContent />
      </head>
      <body>
        <ProfileProvider>{props.children}</ProfileProvider>
        <Scripts />
      </body>
    </html>
  )
}
