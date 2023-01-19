import React, { ChangeEvent } from 'react'
import styles from './main.module.scss'
import { OrderHOC } from '../orders'
import { book_snapshot_type, order, subscribeMessage } from './main.types'
import Loader from '../loader'
import { MOBILE_WIDTH, subscribeConstant } from '../constants/subscride_api'
import { WindowSizeContext } from '../App'
import Visualizer from '../depth_visualizer'


const Main = () => {

  const bidsDivision = React.useRef<number[]>([]);
  const asksDivision = React.useRef<number[]>([]);
  const spread = React.useRef<number[]>([]);
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const timerRef:{current: NodeJS.Timeout | any} = React.useRef(null)

  const [subscribeMessage, setSubscribeMessage] = React.useState<subscribeMessage>(subscribeConstant)
  const [orders, setOrders] = React.useState<order | null>()
  const [book_snapshot, setBookSnapshot] = React.useState<book_snapshot_type | null>()
  const [popup, setPopup] = React.useState<boolean>(false)
  const [digits, setDigits] = React.useState<number>(2)


  React.useEffect(() => {
    const ws: WebSocket = new WebSocket('wss://www.cryptofacilities.com/ws/v1')
    const data: Set<string> = new Set();

    const flush = () => {
      for (let value of data) {
        if (JSON.parse(value)?.feed === 'book_snapshot') {
          setBookSnapshot(JSON.parse(value))
        }
        setOrders(JSON.parse(value));
      }
      data.clear();
    };

    let timer = setInterval(flush, 1000);
    timerRef.current = timer;

    ws.onopen = () => {
      console.log('socket connection opened.')
      ws.send(JSON.stringify(subscribeMessage))
    };

    ws.onmessage = (event) => {
      if (JSON.parse(event.data).event === 'alert') {
        setSubscribeMessage(subscribeConstant)
      }
      data.add(event.data);
    };
    ws.onclose = () => {
      console.log('socket connection closed');
      data.clear()
      ws.close();
    };

    return () => {
      clearInterval(timer);
      ws.close();
      flush();
    };
  }, [subscribeMessage])

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDigits(Number(e.target.value));
  }

  const size = React.useContext(WindowSizeContext)

  return (
    <div>
      {book_snapshot && orders ? (
        <div className={styles.container}>
          <div className={styles.header}>
            <h2>Order Book</h2>
            {size.width >= MOBILE_WIDTH ? <span>Spread: {spread.current}</span> : null}
            <select value='2' onChange={handleChange}>
              <option value="1">Group 0.1</option>
              <option value="2">Group 0.01</option>
              <option value="3">Group 0.001</option>
            </select>
          </div>
          <div className={styles.flex}>
            <div className={styles.graph}>
              <Visualizer orderType={0} division={bidsDivision} />
              <Visualizer orderType={1} division={asksDivision} />
            </div>
            <div className={styles.orders}>
              <OrderHOC snapshot={book_snapshot} order={orders} setDivision={{ bidsDivision, asksDivision }} setSpread={spread} digits={digits} />
            </div>
          </div>
          <div className={styles.footer}>
            <button className={styles.toggleButton}
              onClick={() => {
                setPopup(true)
                if (!inputRef.current) throw Error("divRef is not assigned");
                if (inputRef.current.value === '') {
                  console.log('write some');
                } else {
                  setSubscribeMessage({
                    event: 'subscribe',
                    feed: 'book',
                    product_ids: [inputRef.current.value]
                  })
                  setBookSnapshot(null)
                  setPopup(false)
                }
              }}
            >
              Toggle feed
            </button>
            <span className={styles.market_name}>
              Selected market:  {popup ? <input ref={inputRef} /> : subscribeMessage.product_ids[0]}
            </span>
            <button className={styles.killButton} onClick={() => clearInterval(timerRef.current)}>
              Kill feed
            </button>
          </div>
        </div>
      ) : <Loader />}

    </div>
  )
}


export default Main