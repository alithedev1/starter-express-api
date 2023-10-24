const app = require('express')();

app.get('/', (req, res) => {
    res.send('Hahahah')
})


app.listen(process.env.PORT || 3000)