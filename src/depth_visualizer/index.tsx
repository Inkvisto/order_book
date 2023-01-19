import React, { FunctionComponent } from 'react';
import { WindowSizeContext } from '../App';
import { MOBILE_WIDTH } from '../constants/subscride_api';
import { OrderType } from '../main/main.types';

interface DepthVisualizerProps {
  depth: number;
  orderType: OrderType;
  windowWidth: number;
  top:number;
}

const DepthVisualizerColors = {
  BIDS: "#113534",
  ASKS: "#3d1e28"
};


const DepthVisualizer: FunctionComponent<DepthVisualizerProps> = ({windowWidth, depth, orderType,top }) => {
  return <div data-testid="depth-visualizer" style={{
    backgroundColor: `${orderType === OrderType.BIDS ? DepthVisualizerColors.BIDS : DepthVisualizerColors.ASKS}`,
    height: "1.250em",
    width: `${depth}%`,
    position: 'absolute',
    display:'flex',
    marginTop:`${windowWidth <= MOBILE_WIDTH ? orderType === OrderType.BIDS ? '-20px':'42.5vh': 0}`,
    top: `${90+17.5*top}px`,
    left: `${windowWidth <= MOBILE_WIDTH ? 0 : orderType === OrderType.BIDS ? `${50 - depth}%` : '50%'}`,
    zIndex: 0,
    maxWidth:`${orderType === OrderType.BIDS && windowWidth > MOBILE_WIDTH ? '100%' : '50%'}`,
    borderTop:'1px rgba(255, 255, 255, .1) solid'
  }} />;
};


export const Visualizer = ({orderType,division}:any) => {
  const size = React.useContext(WindowSizeContext)
   return division.current.map((e:number,i:number)=>{
    let graphValues = Number((e*50).toFixed(2))
    return <DepthVisualizer key={i} depth={graphValues} orderType={orderType} windowWidth={size.width} top={i} />
  })
}



export default Visualizer;