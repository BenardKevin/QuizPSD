var Question = function (questionObj) {
    this.value = {
      text: "Question",
      answers: []
    };
  
    this.selectedAnswer = null;
    this.html = null;
    this.questionText = null;
    this.questionAnswers = null;
    this.questionFeedback = null;
  
    this.value = Object.assign(this.value, questionObj);
  
    this.onQuestionAnswered = ({ detail }) => {
      this.selectedAnswer = {
        value: detail.answer,
        html: detail.answerHtml
      };
      this.update();
  
      document.dispatchEvent(
        new CustomEvent("question-answered", {
          detail: {
            question: this,
            answer: detail.answer
          }
        })
      );
    };
  
    this.create = function (i) {
      this.html = document.createElement("div");
      this.html.classList.add("question");
  
      this.questionNumber = document.createElement("h2");
      i+=1;
      this.questionNumber.textContent = "Question " + i + " of 80";

      this.questionText = document.createElement("h2");
      this.questionText.textContent = this.value.text;
  
      this.questionAnswers = document.createElement("div");
      this.questionAnswers.classList.add("answers");
  
      for (let i = 0; i < this.value.answers.length; i++) {
        const ansObj = this.value.answers[i];
        let answer = createAnswer(ansObj);
  
        answer.onclick = (ev) => {
          if (this.selectedAnswer !== null) {
            this.selectedAnswer.html.classList.remove("selected");
          }
  
          answer.classList.add("selected");
  
          this.html.dispatchEvent(
            new CustomEvent("question-answered", {
              detail: {
                answer: ansObj,
                answerHtml: answer
              }
            })
          );
        };
        
        this.questionAnswers.appendChild(answer);
      }
  
      this.questionFeedback = document.createElement("div");
      this.questionFeedback.classList.add("question-feedback");
  
      this.html.appendChild(this.questionNumber);
      this.html.appendChild(this.questionText);
      this.html.appendChild(this.questionAnswers);
      this.html.appendChild(this.questionFeedback);
  
      this.html.addEventListener("question-answered", this.onQuestionAnswered);
  
      return this.html;
    };
  
    this.disable = function () {
      this.html.classList.add("disabled");
      this.html.onclick = (ev) => {
        ev.stopPropagation();
      };
  
      this.html.removeEventListener("question-answered", this.onQuestionAnswered);
  
      let answers = this.html.querySelectorAll(".answer");
      for (let i = 0; i < answers.length; i++) {
        let answer = answers[i];
        answer.onclick = null;
      }
    };
  
    this.remove = function () {
      let children = this.html.querySelectorAll("*");
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        this.html.removeChild(child);
      }
  
      this.html.removeEventListener("question-answered", this.onQuestionAnswered);
  
      this.html.parentNode.removeChild(this.html);
      this.html = null;
    };
  
    this.update = function () {
      let correctFeedback, incorrectFeedback;
      this.html = this.html || document.createElement("div");
  
      correctFeedback = "Nice! You got it right.";
      incorrectFeedback = "Oh! Not the correct answer.";
  
      if (this.selectedAnswer !== null) {
        if (this.selectedAnswer.value.isCorrect) {
          this.html.classList.add("correct");
          this.html.classList.remove("incorrect");
          this.questionFeedback.innerHTML = correctFeedback;
        } else {
          this.html.classList.add("incorrect");
          this.html.classList.remove("correct");
          this.questionFeedback.innerHTML = incorrectFeedback;
        }
      }
    };
  
    function createAnswer(obj) {
      this.value = {
        text: "Answer",
        isCorrect: false
      };
  
      this.value = Object.assign(this.value, obj);
  
      this.html = document.createElement("button");
      this.html.classList.add("answer");
  
      this.html.textContent = this.value.text;
  
      return this.html;
    }
  };

  const questionsData = [
    {
        text: "When can Product Backlog Refinement occur?",
        isMultiChoice: true,
        answers: [
            { text: "Only during Sprint Planning.", isCorrect: false },
            { text: "Anytime during the Sprint.", isCorrect: true },
            { text: "Only during Refinement meetings planned by the Product Owner.", isCorrect: false },
            { text: "Before Sprint Planning.", isCorrect: false },
        ],
    },
    {
        text: "What would NOT be considered Refactoring?",
        isMultiChoice: true,
        answers: [
            { text: "Reordering method parameters to improve readability.", isCorrect: false },
            { text: "Extracting interfaces.", isCorrect: false },
            { text: "Renaming things to be more logical.", isCorrect: false },
            { text: "Changing external interfaces or APIS.", isCorrect: true },
            { text: "Extracting methods.", isCorrect: false },
        ],
    },
    {
        text: "Your Scrum Team is one of seven teams working on a Software Product. All teams use the same Version Control System. Which is the best approach to deliver a high-quality Increment?",
        isMultiChoice: true,
        answers: [
            { text: "Developers should perform a combination of local and private builds.", isCorrect: false },
            { text: "Each team's automated build is integrated toward the end of the Sprint.", isCorrect: false },
            { text: "There is one automated and integrated build for all seven teams.", isCorrect: true },
            { text: "Each team should have its own automated build.", isCorrect: false },
        ],
    },
    {
        text: "Who creates documentation included with an Increment?",
        isMultiChoice: true,
        answers: [
            { text: "The Developers.", isCorrect: true },
            { text: "Increments do not need documentation.", isCorrect: false },
            { text: "The Product Owner.", isCorrect: false },
            { text: "Technical Writers.", isCorrect: false },
            { text: "The Scrum Master.", isCorrect: false },
        ],
    },
    {
        text: "What is a merge in a Version Control System?",
        isMultiChoice: true,
        answers: [
            { text: "Copying a portion of a code base to isolate it from the original codebase.", isCorrect: false },
            { text: "Identifying a particular codebase as ready for distribution.", isCorrect: false },
            { text: "Triggering a Deployment into Production.", isCorrect: false },
            { text: "Combining two or more versions of code into a single codebase.", isCorrect: true },
        ],
    },
    {
        text: "Which concept is described by the Last Responsible Moment?",
        isMultiChoice: true,
        answers: [
            { text: "Making decisions as soon as possible to close feedback loops as soon as possible.", isCorrect: false },
            { text: "Discover decisions to be made as soon as possible but postpone deciding to the latest reasonable moment.", isCorrect: true },
            { text: "The last moment in a Sprint when code changes are allowed, after this only stabilization work should be conducted.", isCorrect: false },
            { text: "Opening a learning window to validate hypotheses and create learning.", isCorrect: false },
            { text: "The last moment a Developer is responsible for quality, after this the Tester is responsible.", isCorrect: false },
        ],
    },
    {
        text: "Why does a test written using TDD (Test Driven Development) initially fail?",
        isMultiChoice: true,
        answers: [
            { text: "Because the test has not been refactored.", isCorrect: false },
            { text: "Because it has to be put into an automated test harness to be run.", isCorrect: false },
            { text: "Because the tests are checked in before the Product code exists.", isCorrect: false },
            { text: "Because the Product code to satisfy the test does not yet exist.", isCorrect: true },
        ],
    },
    {
        text: "When do the Developers show their work to the Product Owner?",
        isMultiChoice: true,
        answers: [
            { text: "Whenever the Product Owner asks.", isCorrect: false },
            { text: "During the Sprint Review.", isCorrect: false },
            { text: "Anytime the Developers need feedback from the Product Owner.", isCorrect: false },
            { text: "All of the above.", isCorrect: true },
        ],
    },
    {
        text: "Who decides the System Architecture of a Product developed using Scrum?",
        isMultiChoice: true,
        answers: [
            { text: "The Architect chosen by the Scrum Team.", isCorrect: false },
            { text: "The Software Architect assigned to the Scrum Team.", isCorrect: false },
            { text: "The Developers with input from the Scrum Team and others.", isCorrect: true },
            { text: "The Chief Architect.", isCorrect: false },
        ],
    },
    {
        text: "When using Continuous Integration, how often should the build be executed?",
        isMultiChoice: true,
        answers: [
            { text: "Once per hour.", isCorrect: false },
            { text: "Whenever new or changed code is checked into version control.", isCorrect: true },
            { text: "Once per day.", isCorrect: false },
            { text: "Before the end of the Sprint.", isCorrect: false },
            { text: "Whenever new tests are created or uncertainty arises about whether old tests will pass.", isCorrect: false },
        ],
    },
    {
        text: "Who determines how work is performed during the Sprint?",
        isMultiChoice: true,
        answers: [
            { text: "The Scrum Master.", isCorrect: false },
            { text: "The Scrum Team.", isCorrect: false },
            { text: "Team Manager.", isCorrect: false },
            { text: "Subject matter experts.", isCorrect: false },
            { text: "The Developers.", isCorrect: true },
        ],
    },
    {
        text: "Who creates tests on a Scrum Team?",
        isMultiChoice: true,
        answers: [
            { text: "The Product Owner.", isCorrect: false },
            { text: "The Developers.", isCorrect: true },
            { text: "Quality Assurance Specialists.", isCorrect: false },
            { text: "The Scrum Master.", isCorrect: false },
        ],
    },
    {
        text: "What is Test First Development (TFD)?",
        isMultiChoice: true,
        answers: [
            { text: "Creating tests before work begins on a Product.", isCorrect: false },
            { text: "Creating tests before writing code.", isCorrect: true },
            { text: "Executing tests before deploying a Product.", isCorrect: false },
            { text: "Writing test cases that Developers should address when creating functionality.", isCorrect: false },
        ],
    },
    {
        text: "Which is the most reliable form of technical documentation?",
        isMultiChoice: false,
        answers: [
            { text: "A spreadsheet of passing manual tests.", isCorrect: false },
            { text: "The Developer's whiteboard.", isCorrect: false },
            { text: "UML model.", isCorrect: false },
            { text: "Release notes.", isCorrect: false },
            { text: "A help file.", isCorrect: false },
            { text: "A passing test harness with clear naming and vocabulary.", isCorrect: true }
        ]
    },
    {
        text: "While developing new functionality, you find a bug that has already been delivered to the customer. What do you do?",
        isMultiChoice: false,
        answers: [
            { text: "Revise the tests so that the bug no longer appears on the bug report.", isCorrect: false },
            { text: "Fix the bug.", isCorrect: false },
            { text: "Talk to the Product Owner.", isCorrect: true },
            { text: "Stub out the code that caused the bug so it no longer occurs.", isCorrect: false }
        ]
    },
    {
        text: "Who has the final decision about the order of items in the Product Backlog?",
        isMultiChoice: false,
        answers: [
            { text: "The Scrum Master.", isCorrect: false },
            { text: "The Stakeholders.", isCorrect: false },
            { text: "The Scrum Team.", isCorrect: false },
            { text: "The Developers.", isCorrect: false },
            { text: "The Product Owner.", isCorrect: true }
        ]
    },
    {
        text: "How much time must a Product Owner spend with the Developers?",
        isMultiChoice: false,
        answers: [
            { text: "100%.", isCorrect: false },
            { text: "Enough so that the Product Owner is not surprised by the value delivered by the Increment.", isCorrect: false },
            { text: "40%, or more if the Stakeholders agree.", isCorrect: false },
            { text: "Any amount of time the Developers ask the Product Owner to be present.", isCorrect: true }
        ]
    },
    {
        text: "What are the typical roles when practicing Pair Programming?",
        isMultiChoice: false,
        answers: [
            { text: "Product Owner and Developer.", isCorrect: false },
            { text: "Business Analyst and Developer.", isCorrect: false },
            { text: "Tester and Developer.", isCorrect: false },
            { text: "Driver and Navigator.", isCorrect: true },
            { text: "Frontend and Backend.", isCorrect: false }
        ]
    },
    {
        text: "True or False: When multiple teams work together on the same Product, each team should maintain a separate Product Backlog.",
        isMultiChoice: false,
        answers: [
            { text: "True.", isCorrect: false },
            { text: "False.", isCorrect: true }
        ]
    },
    {
        text: "What is the primary purpose of Refactoring?",
        isMultiChoice: false,
        answers: [
            { text: "Ensuring that all factors are constantly aligned.", isCorrect: false },
            { text: "Removing all bugs that were found during Regression Tests.", isCorrect: false },
            { text: "Making sure that the code is readable and maintainable.", isCorrect: true },
            { text: "Creating better technical documentation.", isCorrect: false }
        ]
    },
    {
        text: "The practice of decomposing a requirement into failing tests is called:",
        isMultiChoice: false,
        answers: [
            { text: "Regression Testing.", isCorrect: false },
            { text: "Object oriented requirements definition.", isCorrect: false },
            { text: "Acceptance Test Driven Development.", isCorrect: true },
            { text: "Behavior Driven Development.", isCorrect: false }
        ]
    },
    {
        text: "What is a mock object?",
        isMultiChoice: false,
        answers: [
            { text: "A test object that mimics the behavior of a dependency in the system under test.", isCorrect: true },
            { text: "A mock helps you create a build script.", isCorrect: false },
            { text: "Mocks, stubs, dummies, fakes, and shims are all the same.", isCorrect: false },
            { text: "A mock is a way to initialize the database for testing.", isCorrect: false }
        ]
    },
    {
        text: "When using Scrum, can a Scrum Team use Continuous Delivery?",
        isMultiChoice: false,
        answers: [
            { text: "Yes, there is nothing in Scrum that conflicts with Continuous Delivery.", isCorrect: true },
            { text: "No, because the Product Owner may not be available each time a PBI is done and the Product Owner has to decide if it should be released.", isCorrect: false },
            { text: "No, because the increment has to be approved at the Sprint Review before it can be released, and a 2-week Sprint would not be considered continuous.", isCorrect: false },
            { text: "No, because Stakeholders may have already seen the new features and the Sprint Review will be meaningless.", isCorrect: false },
            { text: "No, because before releasing an Increment it first has to fulfill the Definition of Done.", isCorrect: false }
        ]
    },
    {
      text: "You are asked to refactor part of the codebase for Application X. When you are done, all Unit Tests pass with 50% Code Coverage. What can you infer from this?",
      isMultiChoice: false,
      answers: [
          { text: "At least 50% of Application X functions correctly.", isCorrect: false },
          { text: "At most 50% of Application X functions correctly.", isCorrect: false },
          { text: "There are no bugs present in Application X.", isCorrect: false },
          { text: "You did not break any existing Unit Tests.", isCorrect: true }
      ]
  },
  {
      text: "What are two ways that regulatory compliance issues are dealt with in Scrum?",
      isMultiChoice: true,
      answers: [
          { text: "They are addressed by a separate team who is responsible for compliance issues.", isCorrect: false },
          { text: "They are addressed along with functional development of the Product.", isCorrect: true },
          { text: "They are discussed, determined, and documented before the actual feature development Sprints.", isCorrect: false },
          { text: "They are added to the Product Backlog and addressed in early Sprints, while always requiring at least some business functionality, no matter how small.", isCorrect: true }
      ]
  },
  {
      text: "True or False: User Stories are required in the Product Backlog.",
      isMultiChoice: false,
      answers: [
          { text: "True.", isCorrect: false },
          { text: "False.", isCorrect: true }
      ]
  },
  {
      text: "In Software Development, DRY refers to:",
      isMultiChoice: false,
      answers: [
          { text: "Code with low Cyclomatic Complexity.", isCorrect: false },
          { text: "Code with minimal duplication.", isCorrect: true },
          { text: "Code that has not been peer reviewed.", isCorrect: false },
          { text: "Code that has been peer reviewed.", isCorrect: false }
      ]
  },
  {
      text: "Which answer best describes Behavior Driven Development (BDD)?",
      isMultiChoice: false,
      answers: [
          { text: "A style of Test Driven Development focusing on user and system interactions.", isCorrect: true },
          { text: "A development style that accounts for leadership style among team members.", isCorrect: false },
          { text: "A way to organize Unit Tests based on class and method structures.", isCorrect: false },
          { text: "A technique for maintaining Regression Test harnesses.", isCorrect: false }
      ]
  },
  {
      text: "When should the Developers create their first automated build?",
      isMultiChoice: false,
      answers: [
          { text: "Just before the Product is released.", isCorrect: false },
          { text: "Before writing the first line of code.", isCorrect: false },
          { text: "When the Product Owner asks for a build.", isCorrect: false },
          { text: "Just before the end of the Sprint.", isCorrect: false },
          { text: "As soon as there is code in the Version Control System.", isCorrect: true }
      ]
  },
  {
      text: "How much work is required of the Developers to complete a Product Backlog Item selected during the Sprint Planning?",
      isMultiChoice: false,
      answers: [
          { text: "A proportional amount of time on analysis, design, development, and testing.", isCorrect: false },
          { text: "All development work and at least some testing.", isCorrect: false },
          { text: "As much as they can fit into the Sprint, with remaining work deferred to the next Sprint.", isCorrect: false },
          { text: "As much as is required to meet the Scrum Team's Definition of Done.", isCorrect: true }
      ]
  },
  {
      text: "What is the role of Modeling in Scrum Teams?",
      isMultiChoice: false,
      answers: [
          { text: "Models are not used by agile teams.", isCorrect: false },
          { text: "Models are maintained along with the Software as it emerges.", isCorrect: false },
          { text: "Models are assembly instructions for the Developers.", isCorrect: false },
          { text: "Modeling may be useful to increase shared understanding.", isCorrect: true }
      ]
  },
  {
      text: "While practicing Test Driven Development, what is done after the test fails?",
      isMultiChoice: false,
      answers: [
          { text: "Write the minimum amount of Product code to satisfy the test.", isCorrect: true },
          { text: "Refactor the test so the code passes.", isCorrect: false },
          { text: "Run it again to make sure it really fails.", isCorrect: false },
          { text: "Implement the required functionality.", isCorrect: false },
          { text: "Meet with the Business Analyst to ensure that the test is correct.", isCorrect: false }
      ]
  },
  {
      text: "What tactic should a Scrum Master use to divide a group of 100 people into multiple Scrum Teams?",
      isMultiChoice: false,
      answers: [
          { text: "Create teams based on their skills across multiple layers (such as database, Ul, etc.).", isCorrect: false },
          { text: "Ask the people to divide themselves into teams.", isCorrect: true },
          { text: "Ask the Product Owner to assign the people to teams.", isCorrect: false }
      ]
  },
  {
      text: "Developers are blocked by an impediment in the middle of the Sprint. The impediment is outside the Developer's control. What should they do?",
      isMultiChoice: false,
      answers: [
          { text: "Stop using Scrum until the impediment is resolved.", isCorrect: false },
          { text: "Complete the work that can be done and complete the remainder during the hardening Sprint.", isCorrect: false },
          { text: "Immediately raise the issue to the Scrum Master.", isCorrect: true },
          { text: "Cancel the Sprint.", isCorrect: false },
          { text: "Drop the Product Backlog Items affected by the impediment from the Sprint Plan.", isCorrect: false }
      ]
  },
  {
      text: "What is an Integration Test?",
      isMultiChoice: false,
      answers: [
          { text: "A test of the user interface.", isCorrect: false },
          { text: "A test runs during a Continuous Integration build.", isCorrect: false },
          { text: "A test of a single unit of functionality.", isCorrect: false },
          { text: "A test of multiple units of functionality.", isCorrect: true }
      ]
  },
  {
      text: "Which of the following describes the focus of the first way of DevOps?",
      isMultiChoice: false,
      answers: [
          { text: "The first set of practices a team should apply before moving to the second way.", isCorrect: false },
          { text: "Using automated build and release pipelines.", isCorrect: false },
          { text: "To deliver value earlier and more frequently.", isCorrect: true },
          { text: "A tool-focused way of introducing DevOps, compared to a mindset way (second way) and organizational structure (third way).", isCorrect: false },
          { text: "A culture of continuous experimentation and learning.", isCorrect: false }
      ]
  },
  {
      text: "True or False: Database design must be complete before coding starts to ensure a solid foundation?",
      isMultiChoice: false,
      answers: [
          { text: "True.", isCorrect: false },
          { text: "False.", isCorrect: true }
      ]
  },
  {
      text: "Which of the following are required by Scrum? (choose all that apply)",
      isMultiChoice: true,
      answers: [
          { text: "Release Burnup Chart.", isCorrect: false },
          { text: "Burndown Chart.", isCorrect: false },
          { text: "Unit Tests.", isCorrect: false },
          { text: "Critical Path Analysis.", isCorrect: false },
          { text: "Refactoring.", isCorrect: false },
          { text: "Build automation.", isCorrect: false },
          { text: "None of the above.", isCorrect: true }
      ]
  },
  {
      text: "Who is responsible for creation of the Definition of Done?",
      isMultiChoice: false,
      answers: [
          { text: "The Scrum Master.", isCorrect: false },
          { text: "The Scrum Team.", isCorrect: true },
          { text: "The Development Team.", isCorrect: false },
          { text: "The Product Owner.", isCorrect: false }
      ]
  },
  {
      text: "Pair Programming is implemented by?",
      isMultiChoice: false,
      answers: [
          { text: "Frontend and Backend Developers.", isCorrect: false },
          { text: "Tester and Developer.", isCorrect: false },
          { text: "Developer and Scrum Master.", isCorrect: false },
          { text: "Two persons working on the same PBI.", isCorrect: true }
      ]
  },
  {
      text: "Which best describes Emergent Architecture?",
      isMultiChoice: false,
      answers: [
          { text: "Development requires clear understanding of architecture.", isCorrect: false },
          { text: "Architecture emerges solely from technical decisions.", isCorrect: false },
          { text: "In Scrum, architecture emerges naturally.", isCorrect: false },
          { text: "Desire to make decisions easier to change in the future.", isCorrect: true },
          { text: "Enterprise Architects must create the foundation.", isCorrect: false }
      ]
  },
  {
      text: "True or False: Best Practices are recommended to solve complex problems.",
      isMultiChoice: false,
      answers: [
          { text: "True.", isCorrect: false },
          { text: "False.", isCorrect: true }
      ]
  },
  {
      text: "When is Performance Testing most effectively performed?",
      isMultiChoice: false,
      answers: [
          { text: "Often, throughout development.", isCorrect: true },
          { text: "Just before deploying.", isCorrect: false },
          { text: "After coding is complete.", isCorrect: false },
          { text: "In Production.", isCorrect: false }
      ]
  },
  {
      text: "Which is LEAST useful when measuring Code Maintainability?",
      isMultiChoice: false,
      answers: [
          { text: "Function Points.", isCorrect: true },
          { text: "Cyclomatic Complexity.", isCorrect: false },
          { text: "Depth of Inheritance.", isCorrect: false }
      ]
  },
  {
    text: "What factor should be considered when establishing the Sprint length?",
    isMultiChoice: false,
    answers: [
        { text: "The need of the team to learn on doing work and measuring results.", isCorrect: true },
        { text: "The frequency at which team formation can be changed.", isCorrect: false },
        { text: "The organization release schedule.", isCorrect: false },
        { text: "The organization has mandated similar length Sprints.", isCorrect: false }
    ]
  },
  {
    text: "True or False: Stakeholders can be included in Product Backlog Refinement?",
    isMultiChoice: false,
    answers: [
        { text: "True.", isCorrect: true },
        { text: "False.", isCorrect: false }
    ]
  },
  {
    text: "What activities would a Product Owner typically undertake between Sprints?",
    isMultiChoice: false,
    answers: [
        { text: "There are no such activities.", isCorrect: true },
        { text: "Work with Quality Assurance departments.", isCorrect: false },
        { text: "Refine the Product Backlog.", isCorrect: false },
        { text: "Update the project plan with Stakeholders.", isCorrect: false }
    ]
  },
  {
    text: "Which best describes the Product Backlog?",
    isMultiChoice: false,
    answers: [
        { text: "It contains all foreseeable tasks and requirements.", isCorrect: false },
        { text: "It is allowed to grow and change as more is learned.", isCorrect: true },
        { text: "It is baselined to follow change management processes.", isCorrect: false },
        { text: "It provides just enough information for the design phase.", isCorrect: false }
    ]
  },
  {
    text: "How do you know that a Development Team is cross-functional?",
    isMultiChoice: false,
    answers: [
        { text: "A few members pair program and do Test Driven Development.", isCorrect: false },
        { text: "The Development Team has all skills to create a potentially releasable increment.", isCorrect: true },
        { text: "Every member can perform every task.", isCorrect: false },
        { text: "There are no conflicts within the Development Team.", isCorrect: false }
    ]
  },
  {
    text: "For transparency, when must a new Increment of working Software be available?",
    isMultiChoice: false,
    answers: [
        { text: "When the Product Owner asks to create one.", isCorrect: false },
        { text: "At the end of every Sprint.", isCorrect: true },
        { text: "Before the release Sprint.", isCorrect: false },
        { text: "Every 3 Sprints.", isCorrect: false },
        { text: "After the Acceptance Testing phase.", isCorrect: false }
    ]
  },
  {
    text: "What is the purpose of a Sprint Review?",
    isMultiChoice: false,
    answers: [
        { text: "To judge the validity of the project.", isCorrect: false },
        { text: "To inspect the Product Increment with the Stakeholders.", isCorrect: true },
        { text: "To review the Scrum Team's activities during the Sprint.", isCorrect: false },
        { text: "To build team spirit.", isCorrect: false }
    ]
  },
  {
    text: "True or False: The Product Owner makes sure the team selects enough from the Product Backlog for a Sprint to satisfy the Stakeholders.",
    isMultiChoice: false,
    answers: [
        { text: "True.", isCorrect: false },
        { text: "False.", isCorrect: true }
    ]
  },
  {
    text: "Which statement best describes the Sprint Backlog as the outcome of the Sprint Planning?",
    isMultiChoice: false,
    answers: [
        { text: "It is the Development Team's plan for the Sprint.", isCorrect: true },
        { text: "Every item has a designated owner.", isCorrect: false },
        { text: "It is a complete list of all work to be done in a Sprint.", isCorrect: false },
        { text: "Each task is estimated in hours.", isCorrect: false },
        { text: "It is ordered by the Product Owner.", isCorrect: false }
    ]
  },
  {
    text: "Which output from Sprint Planning provides the Development Team with a target and overarching direction for the Sprint? (choose the best answer)",
    isMultiChoice: false,
    answers: [
        { text: "The Sprint Goal.", isCorrect: true },
        { text: "Sprint Review minutes.", isCorrect: false },
        { text: "The Release Plan.", isCorrect: false },
        { text: "The Sprint Backlog.", isCorrect: false }
    ]
  },
  {
    text: "The Product Owner determines how many Product Backlog Items the Development Team selects for a Sprint. (choose the best answer)",
    isMultiChoice: false,
    answers: [
        { text: "True, but only after confirmation by the resource manager that the Team has enough capacity.", isCorrect: false },
        { text: "False, capacity and commitment are the Project Manager's responsibility.", isCorrect: false },
        { text: "False, the Scrum Master does that.", isCorrect: false },
        { text: "True.", isCorrect: false },
        { text: "True, accordingly to what was committed to the Stakeholders.", isCorrect: false },
        { text: "False.", isCorrect: true }
    ]
  },
  {
    text: "Who owns the Sprint Backlog? (choose the best answer)",
    isMultiChoice: false,
    answers: [
        { text: "The Scrum Team.", isCorrect: false },
        { text: "The Scrum Master.", isCorrect: false },
        { text: "The Development Team.", isCorrect: true },
        { text: "The Product Owner.", isCorrect: false }
    ]
  },
  {
    text: "When is implementation of a Product Backlog Item considered complete? (choose the best answer)",
    isMultiChoice: false,
    answers: [
        { text: "When the item has no work remaining in order to be potentially released.", isCorrect: true },
        { text: "When Quality Assurance reports that the item passes all Acceptance Criteria.", isCorrect: false },
        { text: "At the end of the Sprint.", isCorrect: false },
        { text: "When all work in the Sprint Backlog related to the item is finished.", isCorrect: false }
    ]
  },
  {
    text: "True or False: Multiple Scrum Teams working on the same project must have the same Sprint start date.",
    isMultiChoice: false,
    answers: [
        { text: "True.", isCorrect: false },
        { text: "False.", isCorrect: true }
    ]
  },
  {
    text: "When is it most appropriate for a Development Team to change the Definition of Done? (choose the best answer)",
    isMultiChoice: false,
    answers: [
        { text: "During Sprint Planning.", isCorrect: false },
        { text: "Prior to starting a new project.", isCorrect: false },
        { text: "Prior to starting a new Sprint.", isCorrect: false },
        { text: "During the Sprint Retrospective.", isCorrect: true }
    ]
  },
  {
    text: "A Scrum Master is working with a Development Team that has members in different physical locations. What action should the Scrum Master take? (choose the best answer)",
    isMultiChoice: false,
    answers: [
        { text: "Ask the Development Team members to alternate who is responsible for meeting setup.", isCorrect: false },
        { text: "Set up the meeting and tell the Development Team that is how it will be done.", isCorrect: false },
        { text: "Inform Management and ask them to solve it.", isCorrect: false },
        { text: "Allow the Development Team to self-manage and determine for itself what to do.", isCorrect: true }
    ]
  },
  {
    text: "Five new Scrum Teams have been created to build one Product. What should the Scrum Master do? (choose the best answer)",
    isMultiChoice: false,
    answers: [
        { text: "Teach the Product Owner to work with the Lead Developers on ordering Product Backlog in a way to avoid too much technical and development overlap.", isCorrect: false },
        { text: "Collect the Sprint tasks from the teams and merge that into a consolidated plan.", isCorrect: false },
        { text: "Teach them that it is their responsibility to work with the other teams to create an integrated Increment.", isCorrect: true },
        { text: "Visit the five teams each day to inspect that their Sprint Backlogs are aligned.", isCorrect: false }
    ]
  },
  {
    text: "True or False: Scrum is a methodology that tells in detail how to build Software incrementally.",
    isMultiChoice: false,
    answers: [
        { text: "True.", isCorrect: false },
        { text: "False.", isCorrect: true }
    ]
  },
  {
    text: "In the Sprint Planning meeting, the Product Owner and the Development Team were unable to reach a clear understanding about the highest order Product Backlog Items. Because of this, the Development Team couldn't figure out how many Product Backlog Items it could forecast for the upcoming Sprint. They were able to agree on a Sprint Goal, however. Which of the following two actions should the Scrum Master support? (choose the best two answers)",
    isMultiChoice: true,
    answers: [
        { text: "Ask everyone to take as much time as needed to analyze the Product Backlog first, and then reconvene another Sprint Planning meeting.", isCorrect: false },
        { text: "Cancel the Sprint. Send the entire team to an advanced Scrum training and then start a new Sprint.", isCorrect: false },
        { text: "Forecast the most likely Product Backlog Items to meet the goal and create a Sprint Backlog based on a likely initial design and plan. Once the time-box for the Sprint Planning meeting is over, start the Sprint and continue to analyze, decompose, and create additional functionality during the Sprint.", isCorrect: true },
        { text: "Continue the Sprint Planning meeting past its time-box until an adequate number of Product Backlog Items are well enough understood for the Development Team to make a complete forecast. Then start the Sprint.", isCorrect: false },
        { text: "Discuss in the upcoming Sprint Retrospective why this happened and what changes will make it less likely to recur.", isCorrect: true }
    ]
  },
  {
    text: "A member of the Development Team takes the Scrum Master aside to express his concerns about data security issues. What should the Scrum Master do? (choose the best answer)",
    isMultiChoice: false,
    answers: [
        { text: "Create a Product Backlog Item for security.", isCorrect: false },
        { text: "Ask the person to share the issue with the team as soon as possible.", isCorrect: true },
        { text: "Add security to the Definition of Done.", isCorrect: false },
        { text: "Tell the Product Owner to stop further development of features until the issues are fixed.", isCorrect: false },
        { text: "Go check with the Testers.", isCorrect: false }
    ]
  },
  {
    text: "True or False: Cross-functional teams are optimized to work on one technical layer of a system only (e.g. GUI, database, middle tier, interfaces).",
    isMultiChoice: false,
    answers: [
        { text: "False.", isCorrect: true },
        { text: "True.", isCorrect: false }
    ]
  },
  {
    text: "Why does a Development Team need a Sprint Goal?",
    isMultiChoice: false,
    answers: [
        { text: "A Sprint Goal ensures that all of the Product Backlog Items selected for the Sprint are implemented.", isCorrect: false },
        { text: "The Development Team is more focused with a common yet specific goal.", isCorrect: true },
        { text: "Sprint Goals are not valuable. Everything is known from the Product Backlog.", isCorrect: false },
        { text: "A Sprint Goal only gives purpose to Sprint 0.", isCorrect: false }
    ]
  },
  {
    text: "How should Product Backlog Items be chosen when multiple Scrum Teams work from the same Product Backlog?",
    isMultiChoice: false,
    answers: [
        { text: "The Product Owner should provide each team with its own Product Backlog.", isCorrect: false },
        { text: "The Development Teams pull in work in agreement with the Product Owner.", isCorrect: true },
        { text: "Each Scrum Team takes an equal numbers of items.", isCorrect: false },
        { text: "The Scrum Team with the highest velocity pulls Product Backlog Items first.", isCorrect: false },
        { text: "The Product Owner decides.", isCorrect: false }
    ]
  },
  {
    text: "When a Continuous Integration build fails, who ideally ensures the build is repaired? (choose the best answer)",
    isMultiChoice: false,
    answers: [
        { text: "The person who broke the build.", isCorrect: false },
        { text: "The next person who needs the build to complete successfully.", isCorrect: false },
        { text: "The person assigned to the configuration management role within the team.", isCorrect: false },
        { text: "The Tester responsible for validating builds.", isCorrect: false },
        { text: "Whoever the Developers agree should fix it.", isCorrect: true }
    ]
  },
  {
    text: "What happens during Sprint 0? (choose the best answer)",
    isMultiChoice: false,
    answers: [
        { text: "Establish base System Architecture and design, install version control and continuous integration setup.", isCorrect: false },
        { text: "There is no such thing as Sprint 0.", isCorrect: true },
        { text: "Base System Architecture and design.", isCorrect: false },
        { text: "Overall planning, base System Architecture, base design, version control and continuous integration setup.", isCorrect: false },
        { text: "Requirements gathering, version control setup, and continuous integration setup.", isCorrect: false }
    ]
  },
  {
    text: "Product Backlog Items are refined by: (choose the best answer)",
    isMultiChoice: false,
    answers: [
        { text: "The Developers.", isCorrect: false },
        { text: "The Product Owner.", isCorrect: false },
        { text: "The Scrum Team.", isCorrect: true },
        { text: "The Business Analyst and the Product Owner.", isCorrect: false }
    ]
  },
  {
    text: "Who is responsible for the System Architecture of a Product being developed using Scrum? (choose the best answer)",
    isMultiChoice: false,
    answers: [
        { text: "The Architect chosen by the Scrum Team.", isCorrect: false },
        { text: "The Developers.", isCorrect: true },
        { text: "The Software Architect.", isCorrect: false },
        { text: "The Corporate Architect.", isCorrect: false }
    ]
  },
  {
    text: "Who writes tests in a Scrum Team? (choose the best answer)",
    isMultiChoice: false,
    answers: [
        { text: "The Developers.", isCorrect: true },
        { text: "Coders.", isCorrect: false },
        { text: "The Scrum Master.", isCorrect: false },
        { text: "Quality Assurance Specialists.", isCorrect: false }
    ]
  },
  {
    text: "When do the Developers participate in Product Backlog Refinement? (choose the best answer)",
    isMultiChoice: false,
    answers: [
        { text: "Anytime during the Sprint.", isCorrect: true },
        { text: "Never. It is the sole responsibility of the Product Owner to refine the Product Backlog.", isCorrect: false },
        { text: "Only during Refinement sessions planned by the Product Owner.", isCorrect: false },
        { text: "As Part 1 of Sprint Planning.", isCorrect: false }
    ]
  },
  {
    text: "Who should be present during Product Backlog Refinement? (choose the best answer)",
    isMultiChoice: false,
    answers: [
        { text: "The integration architects from the release department.", isCorrect: false },
        { text: "Only the most senior Developers.", isCorrect: false },
        { text: "Anyone that the Scrum Team decides will be valuable during Refinement.", isCorrect: true },
        { text: "The Stakeholders.", isCorrect: false },
        { text: "The external Business Analysts that have prepared the functional details.", isCorrect: false }
    ]
  },
  {
    text: "True or False: Programmers and Testers should not be included in refining Product Backlog Items.",
    isMultiChoice: false,
    answers: [
        { text: "True.", isCorrect: false },
        { text: "False.", isCorrect: true }
    ]
  },
  {
    text: "Why are automated builds important? (choose the best answer)",
    isMultiChoice: false,
    answers: [
        { text: "Without them you cannot tell if your code works.", isCorrect: false },
        { text: "You are unable to check-in code without one.", isCorrect: false },
        { text: "They are part of your done criteria.", isCorrect: false },
        { text: "They provide rapid assurance that defects and configuration management issues have not been introduced.", isCorrect: true }
    ]
  },
  {
    text: "Upon what type of process control is Scrum based? (choose the best answer)",
    isMultiChoice: false,
    answers: [
        { text: "Defined.", isCorrect: false },
        { text: "Empirical.", isCorrect: true },
        { text: "Complex.", isCorrect: false },
        { text: "Hybrid.", isCorrect: false }
    ]
  },
  {
    text: "When might a Sprint be abnormally cancelled? (choose the best answer)",
    isMultiChoice: false,
    answers: [
        { text: "When the Sprint Goal becomes obsolete.", isCorrect: true },
        { text: "When the sales department has an important new opportunity.", isCorrect: false },
        { text: "When the Developers feel that the work is too hard.", isCorrect: false },
        { text: "When it becomes clear that not everything will be finished by the end of the Sprint.", isCorrect: false }
    ]
  },
  {
    text: "Who should know the most about the progress toward a business objective or a release, and be able to explain the alternatives most clearly? (choose the best answer)",
    isMultiChoice: false,
    answers: [
        { text: "The Scrum Master.", isCorrect: false },
        { text: "The Project Manager.", isCorrect: false },
        { text: "The Product Owner.", isCorrect: true },
        { text: "The Developers.", isCorrect: false }
    ]
  },
  {
    text: "When many Scrum Teams are working on a single Product, what best describes the Definition of Done? (choose the best answer)",
    isMultiChoice: false,
    answers: [
        { text: "Each Scrum Team defines and uses its own. The differences are discussed and reconciled during a hardening Sprint.", isCorrect: false },
        { text: "The Scrum Masters from each Scrum Team define a common Definition of Done.", isCorrect: false },
        { text: "Each Scrum Team uses its own, but must make their definition clear to all other teams so the differences are known.", isCorrect: false },
        { text: "All Scrum Teams must have a Definition of Done that makes their combined Increment valuable and useful.", isCorrect: true }
    ]
  },
  {
    text: "During a Sprint, a Developer determines that the Scrum Team will not be able to complete the items in their forecast. Who should be present to review and adjust the Product Backlog Items selected? (choose the best answer)",
    isMultiChoice: false,
    answers: [
        { text: "The Product Owner and the Developers.", isCorrect: true },
        { text: "The Scrum Master, the Project Manager, and the Developers.", isCorrect: false },
        { text: "The Product Owner and all Stakeholders.", isCorrect: false },
        { text: "The Developers.", isCorrect: false }
    ]
  },
  {
    text: "When should the Developers on a Scrum Team be replaced? (choose the best answer)",
    isMultiChoice: false,
    answers: [
        { text: "As needed, with no special allowance for changes in productivity.", isCorrect: false },
        { text: "Never, it reduces productivity.", isCorrect: false },
        { text: "As needed, while taking into account a short-term reduction in productivity.", isCorrect: true },
        { text: "Every Sprint to promote shared learning.", isCorrect: false }
    ]
  }
];
  


  
  // Var init
  let questions = [];
  let score = 0,
    answeredQuestions = 0;
  let appContainer = document.getElementById("questions-container");
  let scoreContainer = document.getElementById("score-container");
  scoreContainer.innerHTML = `Score: ${score}/${80}`;
  
  // Shuffles array in place. 
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  shuffle(questionsData);
  
  // creating questions
  var i = 0;
  for (i; i < 80; i++) {
    let question = new Question({
      text: questionsData[i].text,
      answers: questionsData[i].answers
    });
  
    appContainer.appendChild(question.create(i));
    questions.push(question);
  }
  
  document.addEventListener("question-answered", ({ detail }) => {
    if (detail.answer.isCorrect) {
      score++;
      answeredQuestions++;
      detail.question.disable();
    }
  
    scoreContainer.innerHTML = `Score: ${score}/${80}`;
  
    if (answeredQuestions == 80) {
      setTimeout(function () {
        alert(`Quiz completed! \nFinal score: ${score}/${80}`);
      }, 100);
    }
  });
  