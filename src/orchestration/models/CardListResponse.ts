import { CardListItem } from "./CardListItem.js"

export type CardListResponse = {
    Items: Array<CardListItem>,
    Pagination?: boolean
}