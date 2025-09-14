import del from "del";
import { Task } from "task";

export default Task("clean", () => del(["docs", "static/definitions/DeepsightPlugCategorisation.d.ts"]));
export const cleanWatch = Task("cleanWatch", () => del(["docs/**", "!docs"]));
