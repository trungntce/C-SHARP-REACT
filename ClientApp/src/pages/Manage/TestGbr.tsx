import { useRef } from 'react';
import { Col, Row } from 'reactstrap';
import Breadcrumb from '../../components/Common/Breadcrumb';
import api from '../../common/api';
import css from "./TestGbr.module.scss";
import { gbrToSvg } from '../../common/utility';
import svgPanZoom from "svg-pan-zoom"

const TestList = (props: any) => {
  const divRef = useRef<any>();

  api<any>("get", "test/gbr?fileName=3.gbr", {}).then(result => {
    divRef.current.innerHTML = gbrToSvg(result.data);

    const svg = divRef.current.children[0];
    const width = parseInt(svg.getAttribute("width")); // Unit: mm
    const height = parseInt(svg.getAttribute("height")); // Unit: mm

    if(width && height){
      svg.setAttribute("width", width * 2); // mm * 2 => px
      svg.setAttribute("height", height * 2); // mm * 2 => px
      svg.children[2].setAttribute("stroke-width", "0.2");
    }

    drawCircle(0, 0, 2, "red");
    drawCircle(-100, -100, 2, "red");
    drawCircle(100, 150, 2, "red");
    drawCircle(2, 2, 2, "red");

    const panZoom = svgPanZoom(svg, {
      zoomEnabled: true,
      controlIconsEnabled: true,
      fit: true,
      center: true,
    });
  });

  const drawCircle = (x: number, y: number, r: number, color: string) => {
    const svg = divRef.current.children[0];
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttributeNS(null, 'cx', x.toString());
    circle.setAttributeNS(null, 'cy', y.toString());
    circle.setAttributeNS(null, 'r', r.toString());
    circle.setAttributeNS(null, 'style', 'stroke: red; stroke-width: 0.5px;' );
    svg.appendChild(circle);
  }

  return (
    <>      
      <div className={`page-content`}>
        <div className="container-fluid">
          <Breadcrumb 
            folder={"test"}
            breadcrumbItem={"test"}
            />
          <Row className="page-body">
            <Col className="col-12">
              <div className={css.gbrContainer} ref={divRef}></div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default TestList;
