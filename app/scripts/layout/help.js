import React from 'react';
import Modali, { useModali } from 'modali';
import HelpContent from '../components/helpcontent';
 
  
const Help = () => {
  const [helpModal, toggleHelpModal] = useModali();
 
  return (
      <div>
    <div className= "navBar__list__item__btn" onClick={toggleHelpModal}>
                <div className="navBar__icon">
                    <span className="DANE__Geovisor__icon__ask"></span>
                </div>
                <p className="navBar__iconName">Ayuda</p>
    </div>
        <Modali.Modal {...helpModal}>
          <HelpContent />
        </Modali.Modal>
      </div>
  );
};

export default Help;

