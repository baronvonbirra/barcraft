import React, { useState, useEffect } from 'react';
import localPlaceholder from '../assets/cocktails/placeholder.jpg';

const SUPABASE_STORAGE_URL = 'https://lgiwnmlsggwvgvocsgbs.supabase.co/storage/v1/object/public/cocktails';

const CocktailImage = ({ src, alt, ...props }) => {
  const getInternalState = (path) => {
    if (!path) {
      return {
        imgSrc: `${SUPABASE_STORAGE_URL}/placeholder.jpg`,
        fallbackLevel: 1
      };
    }

    const fileName = path.substring(path.lastIndexOf('/') + 1);
    return {
      imgSrc: `${SUPABASE_STORAGE_URL}/${fileName}`,
      fallbackLevel: 0
    };
  };

  const [state, setState] = useState(() => getInternalState(src));

  useEffect(() => {
    setState(getInternalState(src));
  }, [src]);

  const handleError = () => {
    if (state.fallbackLevel === 0) {
      setState({
        imgSrc: `${SUPABASE_STORAGE_URL}/placeholder.jpg`,
        fallbackLevel: 1
      });
    } else if (state.fallbackLevel === 1) {
      setState({
        imgSrc: localPlaceholder,
        fallbackLevel: 2
      });
    }
  };

  return <img src={state.imgSrc} alt={alt} onError={handleError} {...props} />;
};

export default CocktailImage;
