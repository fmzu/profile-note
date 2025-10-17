import { createFileRoute } from "@tanstack/react-router"
import SlugGame from "./slug"

export const Route = createFileRoute("/slug/")({
  component: SlugGame,
})
