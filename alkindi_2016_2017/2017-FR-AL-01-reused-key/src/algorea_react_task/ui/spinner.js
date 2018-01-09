import React from 'react';
import EpicComponent from 'epic-component';

export default EpicComponent(self => {

    self.render = () => {
        return (
            <div className='text-center' style={{fontSize: '300%'}}><i className="fa fa-spinner fa-spin"/></div>
        );
   };

});