const express = require('express')
const { urlencoded, json } = require('body-parser')
const makeRepositories = require('./middleware/repositories')
const { v4 } = require('uuid')

const STORAGE_FILE_PATH = 'questions.json'
const PORT = 3000

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))

app.get('/', (_, res) => {
  res.json({ message: 'Welcome to responder!' })
})

app.get('/questions', async (req, res) => {
  const questions = await req.repositories.questionRepo.getQuestions()
  res.json(questions)
})

app.get('/questions/:questionId', async (req, res) => {
  const foundQuestion = await req.repositories.questionRepo.getQuestionById(
    req.params.questionId
  )
  res.json(foundQuestion)
})

app.post('/questions', async (req, res) => {
  const newQuestion = {
    id: v4(),
    author: req.body.author ?? '',
    summary: req.body.summary ?? ''
  }
  const addedQuestion = await req.repositories.questionRepo.addQuestion(
    newQuestion
  )
  res.status(201).json(addedQuestion)
})

app.get('/questions/:questionId/answers', async (req, res) => {
  const foundAnswers = await req.repositories.questionRepo.getAnswers(
    req.params.questionId
  )
  res.json(foundAnswers)
})

app.post('/questions/:questionId/answers', async (req, res) => {
  const newAnswer = {
    id: v4(),
    author: req.body.author ?? '',
    summary: req.body.summary ?? ''
  }
  const addedAnswer = await req.repositories.questionRepo.addAnswer(
    req.params.questionId,
    newAnswer
  )

  res.status(201).json(addedAnswer)
})

app.get('/questions/:questionId/answers/:answerId', async (req, res) => {
  const foundAnswer = await req.repositories.questionRepo.getAnswer(
    req.params.questionId,
    req.params.answerId
  )
  res.json(foundAnswer)
})

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})
