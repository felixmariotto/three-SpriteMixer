
const express = require( 'express' );
const path = require( 'path' );
const app = new express();
const PORT = 5000 ;


app.use(express.static('public'));

app
	.get('/', (req, res)=> {
		res.sendFile(path.join(__dirname + '/examples/index.html'));
	})

	.get('/indexed', (req, res)=> {
		res.sendFile(path.join(__dirname + '/examples/from_indexed_texture.html'));
	})

	.listen(PORT, ()=> {
		console.log('App listening on port ' + PORT);
	})