const { writeFile, rm } = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { makeQuestionRepository } = require('./question')

describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  let questionRepo

  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))

    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })

  test('should return a list of 0 questions', async () => {
    expect(await questionRepo.getQuestions()).toHaveLength(0)
  })

  test('should return a list of 2 questions', async () => {
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: faker.datatype.uuid(),
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await questionRepo.getQuestions()).toHaveLength(2)
  })

  test('should return a question by id', async () => {
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: faker.datatype.uuid(),
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const question = await questionRepo.getQuestionById(testQuestions[0].id)

    expect(question).toEqual(testQuestions[0])

    const question2 = await questionRepo.getQuestionById(testQuestions[1].id)

    expect(question2).toEqual(testQuestions[1])
  })

  test('should add a question', async () => {
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: faker.datatype.uuid(),
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const newQuestion = {
      id: faker.datatype.uuid(),
      summary: 'What is your name?',
      author: 'Jack London',
      answers: []
    }

    await questionRepo.addQuestion(newQuestion)

    const questions = await questionRepo.getQuestions()

    expect(questions).toHaveLength(3)
    expect(questions).toContainEqual(newQuestion)
  })

  test('should return a list of 0 answers', async () => {
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: faker.datatype.uuid(),
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const answers = await questionRepo.getAnswers(testQuestions[0].id)

    expect(answers).toHaveLength(0)
  })

  test('should return a list of 2 answers', async () => {
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Jack London',
        answers: [
          {
            id: 'ce7bddfb-0544-4b14-92d8-188b03c41ee4',
            author: 'Brian McKenzie',
            summary: 'The Earth is flat.'
          },
          {
            id: 'd498c0a3-5be2-4354-a3bc-78673aca0f31',
            author: 'Dr Strange',
            summary: 'It is egg-shaped.'
          }
        ]
      },
      {
        id: faker.datatype.uuid(),
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const answers = await questionRepo.getAnswers(testQuestions[0].id)

    expect(answers).toHaveLength(2)
  })

  test('should add an answer', async () => {
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Jack London',
        answers: [
          {
            id: 'ce7bddfb-0544-4b14-92d8-188b03c41ee4',
            author: 'Brian McKenzie',
            summary: 'The Earth is flat.'
          },
          {
            id: 'd498c0a3-5be2-4354-a3bc-78673aca0f31',
            author: 'Dr Strange',
            summary: 'It is egg-shaped.'
          }
        ]
      },
      {
        id: faker.datatype.uuid(),
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const newAnswer = {
      id: faker.datatype.uuid(),
      author: 'Dr Strange',
      summary: 'It is egg-shaped.'
    }

    await questionRepo.addAnswer(testQuestions[0].id, newAnswer)

    const answers = await questionRepo.getAnswers(testQuestions[0].id)

    expect(answers).toHaveLength(3)
    expect(answers).toContainEqual(newAnswer)
  })

  test('should return answer by id', async () => {
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Jack London',
        answers: [
          {
            id: 'ce7bddfb-0544-4b14-92d8-188b03c41ee4',
            author: 'Brian McKenzie',
            summary: 'The Earth is flat.'
          },
          {
            id: 'd498c0a3-5be2-4354-a3bc-78673aca0f31',
            author: 'Dr Strange',
            summary: 'It is egg-shaped.'
          }
        ]
      },
      {
        id: faker.datatype.uuid(),
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const answer = await questionRepo.getAnswer(
      testQuestions[0].id,
      testQuestions[0].answers[0].id
    )

    expect(answer).toEqual(testQuestions[0].answers[0])
  })
})
