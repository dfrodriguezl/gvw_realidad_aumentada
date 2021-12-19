import React from 'react';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { variables } from '../base/variables';

const Load = () => {

   const [visible, setVisible] = React.useState({ display: "none" });

   variables.changeLoader = function (state) {
      if (state) {
         setVisible({ display: "none" })
      } else {
         setVisible({ display: "block" })
      }
   }

   return (
      <div className="loader" style={visible}>
         <div className="loader__content">
            <div className="loader__content__icon">
               <span className="DANE__Geovisor__icon__DANE__D"></span>
            </div>
            <div className="loader__content__ballsContent">
               <div className="loader__content__ballsContent__ball"></div>
               <div className="loader__content__ballsContent__ball"></div>
               <div className="loader__content__ballsContent__ball"></div>
               <div className="loader__content__ballsContent__ball"></div>
            </div>
         </div>
      </div>
   );
}

export default Load;