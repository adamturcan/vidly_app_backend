const request = require('supertest')
const Genre = require('../../models/genre');
const User = require('../../models/user')
const mongoose = require('mongoose')
let server;
 
describe('/api/genres', () => {
    beforeEach(() => { server = require('../../index') })
    afterEach(async () => {
        await server.close();
        await Genre.remove({})
    })

    describe('GET /', () => { 
           

   
        it('should return all genres', async() => {
            await Genre.collection.insertMany([{ name: 'genre1' }, { name: 'genre2' }]);

            const res = await request(server).get('/api/genres');
   
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        }) 
    }); 
    describe('GET/:id', () => {
        it('should return "Genre not found" if invalid id ', async () => {
            const id = 34
            const genre = await request(server).get(`/api/genres/${id}`)
            expect(genre.status).toBe(404) 
            expect(genre.res.text).toBe("Genre not found in our list")
        });
        it('should return "Genre not found" if given genre is not in the db', async () => {

            const genre = await request(server).get(`/api/genres/${mongoose.Types.ObjectId()}`)
            expect(genre.status).toBe(404)
            expect(genre.res.text).toBe("Genre not found in our list")
        });
        it('should return genre if valid id is passed', async () => {
            const genre = new Genre({ genre: "genre1" })
            await genre.save()

            const res = await request(server).get('/api/genres/' + genre._id)
            //console.log(res.res.statusCode) 
            expect(res.status).toBe(200)
            expect(JSON.parse(res.res.text)).toHaveProperty('genre', genre.genre)




        })

    });
    describe('POST/', () => {
        let token;
        let genre;

        const exec = async () => {
            return await request(server).post('/api/genres').send({ genre }).set('x-auth-token', token)

        }
        beforeEach(() => {
            token = new User().generateAuthToken()
            genre = 'genre1'
        })


        it('should return 401 if client is not logged in', async () => {
            token = ''
            const res = await exec();
            expect(res.status).toBe(401)
        });
        it('should return 400 if genre is less than 5 characters long', async () => {
            genre = '1234'

            const res = await exec()

            expect(res.status).toBe(400)
        });
        it('should return 400 if genre is more than 50 characters long', async () => {

            genre = new Array(88).join('a')

            const res = await exec()

            expect(res.status).toBe(400)
        });
        it('should save and return the genre if it is valid', async () => {

            const res = await exec()
            const genre = await Genre.find({ genre: 'genre1' })

            expect(genre[0]._doc.genre).toEqual(res.body.genre)
            expect(res.status).toBe(200)

        })

    });
    describe('PUT/:id', () => {
        const exec = async () => {
            return await request(server).put(`/api/genres/${id}`).send({ genre }).set('x-auth-token', token)

        }
        beforeEach(() => {
            token = new User().generateAuthToken()
            genre = 'genre1'
            id = mongoose.Types.ObjectId()
        })

        let token;
        let genre;
        let id;

        it('should return 401 if client is not logged in', async () => {
            token = ''
            const res = await exec();
            expect(res.status).toBe(401)
        });
        it('should return "Genre not found" if invalid id ', async () => {
            id = 34
            const genre = await request(server).get(`/api/genres/${id}`)
            expect(genre.status).toBe(404)
            expect(genre.res.text).toBe("Genre not found in our list")
        });
        it('should return "Genre not found" if given genre is not in the db', async () => {

            const genre = await request(server).get(`/api/genres/${mongoose.Types.ObjectId()}`)
            expect(genre.status).toBe(404)
            expect(genre.res.text).toBe("Genre not found in our list")
        });
        it('should return 400 if genre is less than 5 characters long', async () => {
            genre = '1234'

            const res = await exec()

            expect(res.status).toBe(400)
        });
        it('should return 400 if genre is more than 50 characters long', async () => {

            genre = new Array(88).join('a')
            //s
            const res = await exec()

            expect(res.status).toBe(400)
        });
        it('should return 200 and genre if genre was updated and saved', async () => {
            let genree = new Genre({ genre: "parody" })
            await genree.save()

            genree = await Genre.find({ genre: 'parody' })
            id = genree[0]._doc._id
            genre = 'horror'
            let res = await exec()
            const updated = await Genre.find({ genre: 'horror' })
            expect(res.status).toBe(200)
            expect(updated[0]._doc._id).toEqual(id)


        })

    });
    describe('DELETE/:id', () => {
        const exec = async () => {
            return await request(server).delete(`/api/genres/${id}`).set('x-auth-token', token)

        }
        beforeEach(() => {
            token = new User().generateAuthToken()
            id = mongoose.Types.ObjectId()
        })

        let token;
        let id;
        it('should return 401 if client is not logged in', async () => {
            token = ''
            const res = await exec();
            expect(res.status).toBe(401)
        });
        it('should return 403 if client is not admin', async () => {
            const user = { _id: mongoose.Types.ObjectId().toHexString() }
            token = new User(user).generateAuthToken();

            const res = await exec();
            expect(res.status).toBe(403)
        })
        it('should return "Genre not found" if invalid id ', async () => {
            id = 34
            const genre = await request(server).get(`/api/genres/${id}`)
            expect(genre.status).toBe(404)
            expect(genre.res.text).toBe("Genre not found in our list")
        });
        it('should return "Genre not found" if given genre is not in the db', async () => {

            const genre = await request(server).get(`/api/genres/${mongoose.Types.ObjectId()}`)
            expect(genre.status).toBe(404)
            expect(genre.res.text).toBe("Genre not found in our list")
        });
        it('should delete and return removed genre if valid id', async () => {
            let genree = new Genre({ genre: "sci-fy" })
            await genree.save();

            genree = await Genre.find({ genre: 'sci-fy' })
            id = genree[0]._doc._id


            const user = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true }
            token = new User(user).generateAuthToken();

            let res = await exec()
            expect(res.status).toBe(200);
            expect(res.body._id).toEqual(id.toHexString()); 
            expect(await Genre.findById(id)).toBe(null)
 
 
        })

 
    })
})   