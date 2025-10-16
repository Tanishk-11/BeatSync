import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage

os.environ['TRANSFORMERS_CACHE'] = '/tmp/transformers_cache'
load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
    raise ValueError("GROQ_API_KEY not found in .env file or environment variables")

print("Loading vector store from 'faiss_index'...")
embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vector_store = FAISS.load_local(
    "faiss_index",
    embeddings=embedding,
    allow_dangerous_deserialization=True
)
retriever = vector_store.as_retriever()
print("Vector store loaded successfully.")

llm = ChatGroq(model="openai/gpt-oss-20b", api_key=groq_api_key)

contextualize_q_system_prompt = (
    "Given a chat history and the latest user question "
    "which might reference context in the chat history, "
    "formulate a standalone question which can be understood "
    "without the chat history. Do NOT answer the question, "
    "just reformulate it if needed and otherwise return it as is."
)
contextualize_q_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", contextualize_q_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)
history_aware_retriever = create_history_aware_retriever(llm, retriever, contextualize_q_prompt)

qa_system_prompt = (
    "You are an expert at psychology and cardiology. With an H index of 110 you have written a ton of "
    "research papers and have an experience of over 25 years in medical "
    "science and a PHD as well in cardiology. So please help the user find out the best response to any user "
    "and use the document provided as the base and then you could follow up with any source."
    "Also do not exceed 50 words. Do not try to answer with bold letters , italic letters or tables. Keep the response simple and to the point.\n\n"
    "{context}"
)
qa_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", qa_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)
question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)
chat_history = []

print("RAG chain initialized successfully.")


def ask_question(question: str):
    """Handles a single user query and maintains chat history."""
    global chat_history
    response = rag_chain.invoke({"input": question, "chat_history": chat_history})
    chat_history.append(HumanMessage(content=question))
    chat_history.append(AIMessage(content=response["answer"]))
    return response["answer"]
