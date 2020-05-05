import React from 'react'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import styled from 'styled-components'

const CustomLabels = styled.div`
.rangeslider__handle {
  width: 34px;
  height: 34px;
  border-radius: 30px;
  text-align: center;
  xbackground: #222;
}

.rangeslider__handle:after {
  display: none;
}

.rangeslider__handle-label {
  color: black;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%,-50%,0)
}

`


export default function RangeSlider({ speed, handleChangeSpeed }) {
  const [value, setValue] = React.useState(speed)
  React.useEffect(() => {
    setValue(speed)
  }, [speed])
  const horizontalLabels = {
    0: 'Fast',
    1000: 'Slow'
  }

  return (
    <CustomLabels>
      <Slider
        min={0}
        max={1000}
        value={value}
        labels={horizontalLabels}
        handleLabel={String(value)}
        onChange={setValue}
        onChangeComplete={() => handleChangeSpeed(value)}
      />
    </CustomLabels>
  )
}
