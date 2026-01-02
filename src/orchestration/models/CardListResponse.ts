import { CardContainer } from "../../Cards.js"
import { CardListItem } from "./CardListItem.js"
import { Pagination } from "./Pagination.js"

export type CardListResponse = {
    Items: Array<CardListItem>,
    Pagination?: Pagination
}