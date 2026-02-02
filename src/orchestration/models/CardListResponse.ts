import { CardContext } from "./CardContext.js"
import { Pagination } from "./Pagination.js"

export type CardListResponse = {
    Items: Array<CardContext>,
    Pagination?: Pagination
}