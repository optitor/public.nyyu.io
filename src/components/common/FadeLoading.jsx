import React from "react"
import { NDB } from "../../utilities/imgImport"

const Loading = ({ position }) => {
    const style = position
        ? {
              position,
          }
        : null

    return (
        <div style={style} className="lds-ellipsis">
            <div className="symbol_div">
                <div className="img_border">
                    <img src={NDB} alt='NDB' />
                </div>
            </div>
            <div className="dots_div">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}

export default Loading
