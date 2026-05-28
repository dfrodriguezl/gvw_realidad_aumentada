import React, { useEffect } from 'react';
import Modali, { useModali } from 'modali';
import HelpContent from '../components/helpcontent';


const Help = () => {
  const [helpModal, toggleHelpModal] = useModali({ large: true });

  useEffect(() => {
    toggleHelpModal();
  }, []);

  return (
    <div>
      <div className="navBar__list__item__btn" onClick={toggleHelpModal}>
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

