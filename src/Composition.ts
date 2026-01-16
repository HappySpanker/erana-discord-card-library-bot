import { EranaClient } from "./events/EranaClient.js";

export function CreateEranaClient(): EranaClient {

    return new EranaClient();
}