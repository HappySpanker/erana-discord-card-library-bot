import { CardContainer } from "../../Cards.js"
import { CardModel } from "./CardModel.js"
import { Pagination } from "./Pagination.js"

export type CardListResponse = {
    Items: Array<CardModel>,
    Pagination?: Pagination
}