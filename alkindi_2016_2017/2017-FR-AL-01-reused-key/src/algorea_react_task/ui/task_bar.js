import React from 'react';
import EpicComponent from 'epic-component';

export default EpicComponent(self => {

   self.render = () => {
      return (
         <div className='task-bar'>
            <button type='button' className='btn btn-default' onClick={self.props.onValidate}>Validate</button>
         </div>
      );
   };

});