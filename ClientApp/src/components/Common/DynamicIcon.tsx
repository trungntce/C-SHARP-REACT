import Icon, { IconName } from "@ailibs/feather-react-ts";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

const DynamicIcon = forwardRef((props: any, ref: any) => {
  const [iconText, setIconText] = useState<IconName>("airplay");
  useImperativeHandle(ref, () => ({ 
    setIconText
  }));

  if(!iconText || iconText.startsWith("/"))
    return null;
  
  return (
    <Icon name={iconText} size={props.size || 17} />
  );
});

export default DynamicIcon;