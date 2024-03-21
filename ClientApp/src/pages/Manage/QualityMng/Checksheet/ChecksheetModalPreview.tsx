import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Modal } from "reactstrap";

const ChecksheetModalPreview = forwardRef((props: any, ref: any) => {
  const [isOpen, setIsOpen] = useState<any>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let canvas: HTMLCanvasElement | null = null;
  let context: CanvasRenderingContext2D | null | undefined = null;
  let image = new Image();
  const imgUrl = useRef<any>('');
  
  useImperativeHandle(ref, () => ({ 
    onToggleModal,
    setImgUrl
  }));

  const setImgUrl = (url: any) => { 
    imgUrl.current = url;
  }

  const onToggleModal = (e: any) => { 
    setIsOpen(!isOpen);

    image.onload = () => {
      canvas = canvasRef.current!;
      context = canvas.getContext("2d");
      
      canvasRef.current!.width = image.width;
      canvasRef.current!.height = image.height;

      drawImage(context, image);
    }
    console.log('imgUrl', imgUrl.current);
    image.src = window.location.origin + imgUrl.current;
  } 
  const drawImage = (ctx: CanvasRenderingContext2D | null | undefined, img: HTMLImageElement) => {
    ctx?.drawImage(img, 0, 0);
  };

  useEffect(() => { 

  }, [isOpen]);

  return (
    <>
      <Modal
            size="lg"
            isOpen={isOpen}
            toggle={(e: any) => {
                onToggleModal(e);
            }}
            centered={true}
            >
            <div className="modal-header">
                <button
                type="button"
                onClick={() => {
                    setIsOpen(false);
                }}
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                >
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div style={{ position: 'relative' }} className="modal-body d-flex justify-content-center align-items-center">
                <canvas style={{ width: '100%', height: 'auto', position: 'relative' }} ref={canvasRef} />
            </div>
      </Modal>  
    </>
  );
});

export default ChecksheetModalPreview;
