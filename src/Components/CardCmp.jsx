import { useState, useEffect } from 'react';

function CardCmp(informations) {
 
let currentCommit= informations.previous_commit ;
console.log("the infos received:", informations);
console.log("the current commit is : ", currentCommit);

 

 
/*
  useEffect(()=>{
  timestampToDate(timestamp);
  },[timestamp]
  ); */
  return (
    <div>
      
      
    </div>
  );
}

export default CardCmp;