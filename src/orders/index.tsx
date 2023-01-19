import React, { FC } from 'react'
import { WindowSizeContext } from '../App'
import { book_snapshot_type, order, order_snapshot } from '../main/main.types'
import bidsStyles from './bids.module.scss'
import asksStyles from './asks.module.scss'
import { MOBILE_WIDTH } from '../constants/subscride_api'


export interface OrderHocProps {
    snapshot: book_snapshot_type,
    order: order,
    setDivision: {
        asksDivision: {
            current: number[]
        },
        bidsDivision: {
            current: number[]
        }
    },
    setSpread: any,
    digits: number
}

export interface Order {
    snapshot: order_snapshot[],
    order: order[],
    setDivision: any,
    styles: any,
    digits: number
}

let book_snapshot: any = []
let currentBids: order[] = []
let currentAsks: order[] = []


const withOrders = (Component: FC<Order>) => ({ snapshot, order, setDivision, setSpread, digits }: OrderHocProps) => {
    React.useEffect(() => {
        currentBids = []
        currentAsks = []
    }, [snapshot])

    const size = React.useContext(WindowSizeContext)

    if (order?.side === 'buy') {
        currentBids = [...[order], ...currentBids]
    } else {
        currentAsks = [...[order], ...currentAsks]
    }

    const highestBid = () => Math.max(...[...snapshot.bids.slice(0, size.height).map((e: any) => e.price), ...currentBids.map((e) => e.price)])
    const lowestAsk = () => Math.min(...[...snapshot.asks.slice(0, size.height).map((e: any) => e.price), ...currentAsks.map((e) => e.price)])

    const spread = Math.abs(highestBid() - lowestAsk())

    const spreadPercentage = ((spread * 100) / highestBid()).toFixed(digits)
    let spreadValue = `${spread.toFixed(digits)} (${spreadPercentage})%`
    setSpread.current = spreadValue
    let mobile = size.width <= MOBILE_WIDTH;
    let inlineStyles = mobile ? {} : { display: 'flex' };

    return (<div style={{ ...inlineStyles }}>
        <Component
            snapshot={snapshot.bids.slice(0, size.height)}
            order={currentBids}
            styles={bidsStyles}
            setDivision={setDivision.bidsDivision}
            digits={digits}
        />
        {mobile ? <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px' }}>Spread: {spreadValue}</span> : null}
        <Component
            snapshot={snapshot.asks.slice(0, size.height)}
            order={currentAsks}
            styles={asksStyles}
            setDivision={setDivision.asksDivision}
            digits={digits}
        />
    </div>)
}

const Order = ({ snapshot, order, setDivision, styles, digits }: Order) => {
    const size = React.useContext(WindowSizeContext)

    if (order.length > size.height) {
        book_snapshot = []
        order.pop()
    } else {
        book_snapshot = snapshot
        book_snapshot.splice(size.height - order.length, order.length)
    }

    let listOfOrders: any = [...order, ...book_snapshot]
    let total: number[] = [listOfOrders[0].qty]
    let qty = listOfOrders.map((e: any) => e.qty)
    let division: number[] = []

    qty.reduce((previousValue: number, currentValue: number) => {
        total.push(previousValue + currentValue)
        return previousValue + currentValue
    })

    for (var i = 0; i < total.length; i++) {
        division.push(total[i] / Math.max(...total));
    }

    setDivision.current = division

    return (
        <div className={styles.container}>
            <ul>
                <h4 className={styles.caption}>Total</h4>
                {snapshot && total.map((e: number, i:number) => <li key={i} className={styles.list} >{e.toFixed(digits)}</li>)}
            </ul>
            <ul>
                <h4 className={styles.caption}>Size</h4>
                {listOfOrders.map((e: any, i: number) => (
                    <li key={i} className={styles.list}>
                        {e.qty.toFixed(digits)}
                    </li>
                ))}
            </ul>

            <ul className={styles.price}>
                <h4 className={styles.caption}>Price</h4>
                {listOfOrders.map((e: any, i: number) => (
                    <li key={i} className={styles.list}>
                        {e.price.toFixed(digits)}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export const OrderHOC = withOrders(Order)


export default Order