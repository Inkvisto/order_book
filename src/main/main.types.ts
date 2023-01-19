export enum OrderType {
    BIDS,
    ASKS
}

export interface order {
    feed: string;
    price: number;
    product_id: string;
    qty: number;
    seq: number;
    side: string;
    timestamp: number;
}

export type order_snapshot = {
    price: number,
    qty: number
}

export interface book_snapshot_type extends Omit<order,'qty'|'price'|'side'>{
    asks:[
       order_snapshot
    ],
    bids:[
        order_snapshot
    ]
}

export interface subscribeMessage {
    event:string ,
    feed: string,
    product_ids: string[]
}