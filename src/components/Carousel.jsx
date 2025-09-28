import Carousel from 'react-bootstrap/Carousel';

function MyCarousel() {
  return (
    <Carousel>
      <Carousel.Item interval={1000}>
        <img
          className="d-block w-100"
          src="https://www.rituals.co.th/dw/image/v2/BGTC_PRD/on/demandware.static/-/Sites-rituals-TH-Library/default/dwd9a97524/Magazine/2019/namaste/Basics_Building_Skincare_Routine_Product_in_article%20_1.jpg"
          alt="First slide"
          style={{ height: "70vh", objectFit: "cover" }} 
        />
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item interval={500}>
        <img
          className="d-block w-100"
          src="https://f.ptcdn.info/545/073/000/qtcx0i1ya5TuaH0ySQx6-o.jpg"
          alt="Second slide"
          style={{ height: "70vh", objectFit: "cover" }} 
        />
        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://st-th-1.byteark.com/assets.punpro.com/cover-contents/i57865/1677031954964-vikka01.jpg"
          alt="Third slide"
          style={{ height: "70vh", objectFit: "cover" }} 
        />
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default MyCarousel;
