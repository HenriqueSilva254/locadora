import supertest from "supertest";
import app from "../../src/app";
import { createUser } from "../factories/user.factories";
import prisma from "database";
import { createMovie, createMovieAdult } from "../factories/movie.factories";
import httpStatus from "http-status";

beforeEach(async ()=>{
  await prisma.user.deleteMany();
})

const api = supertest(app);

describe("GET /rentals", () => {
  it("should return status 422 when user don't select movie", async () => {
    const user = await createUser()
    
    const { status, text } = await api.post("/rentals").send({userId: user.id});

    expect(status).toBe(422);
    expect(text).toEqual("{\"error\":\"\\\"moviesId\\\" is required\"}");
  })

  it("should return status 422 when user selects more than four movies", async () => {
    const user = await createUser()
    
    const { status, text } = await api.post("/rentals").send({userId: user.id, moviesId:[1, 2, 3, 4, 5]});

    expect(status).toBe(422);
    expect(text).toEqual("{\"error\":\"\\\"moviesId\\\" must contain less than or equal to 4 items\"}");
  })

  it("should return status 402 when user have a pending subscription", async () => {
    const user = await createUser()
    const movie1 = await createMovie()
    const movie2 = await createMovie()

    const rental = await api.post("/rentals").send({userId: user.id, moviesId:[movie1.id]});
    const {status, text} = await api.post("/rentals").send({userId: user.id, moviesId:[movie2.id]});

    expect(status).toBe(402);
    expect(text).toEqual("The user already have a rental!");
  })

  it("should return status 402 when there is an adult film and the user is underage", async () => {
    const user = await createUser()
    const movie1 = await createMovieAdult()
    const {status, text} = await api.post("/rentals").send({userId: user.id, moviesId:[movie1.id]});

    expect(status).toBe(401);
    expect(text).toEqual("Cannot see that movie.");
  })

  it("should return status 402 when rented movie is not available", async () => {
    const user = await createUser()
    const movie1 = await createMovie()
    await api.post("/rentals").send({userId: user.id, moviesId:[movie1.id]});
    const {status, text} = await api.post("/rentals").send({userId: user.id, moviesId:[movie1.id]});

    expect(status).toBe(402);
    expect(text).toEqual("The user already have a rental!");
  })

  it("should return status 402 when rented movie is not available", async () => {
    const user = await createUser()
    const movie1 = await createMovieAdult()

    const {status, text} = await api.post("/movie").send({name: movie1.name, adultsOnly: movie1.adultsOnly})
    expect(status).toBe(httpStatus.CONFLICT);
    expect(text).toEqual("Conflict");
  })
})
