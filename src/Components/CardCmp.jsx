import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function CardCmp() {
  return (
    <Card style={{ width: '18rem' }}>
      
      <Card.Body>
        <Card.Title>File Name </Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
  );
}

export default CardCmp;