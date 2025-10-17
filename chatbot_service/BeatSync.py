# import os
# from dotenv import load_dotenv
# from langchain_huggingface import HuggingFaceEmbeddings
# from langchain_community.vectorstores import FAISS
# from langchain.chains import create_history_aware_retriever, create_retrieval_chain
# from langchain.chains.combine_documents import create_stuff_documents_chain
# from langchain_groq import ChatGroq
# from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
# from langchain_core.messages import HumanMessage, AIMessage

# os.environ['TRANSFORMERS_CACHE'] = '/tmp/transformers_cache'
# load_dotenv()
# groq_api_key = os.getenv("GROQ_API_KEY")
# if not groq_api_key:
#     raise ValueError("GROQ_API_KEY not found in .env file or environment variables")

# print("Loading vector store from 'faiss_index'...")
# cache_dir = "/tmp/huggingface_cache"

# # Load embeddings, explicitly telling it where to cache the model
# embedding = HuggingFaceEmbeddings(
#     model_name="sentence-transformers/all-MiniLM-L6-v2",
#     cache_folder=cache_dir
# )
# vector_store = FAISS.load_local(
#     "faiss_index",
#     embeddings=embedding,
#     allow_dangerous_deserialization=True
# )
# retriever = vector_store.as_retriever()
# print("Vector store loaded successfully.")

# llm = ChatGroq(model="openai/gpt-oss-20b", api_key=groq_api_key)

# contextualize_q_system_prompt = (
#     "Given a chat history and the latest user question "
#     "which might reference context in the chat history, "
#     "formulate a standalone question which can be understood "
#     "without the chat history. Do NOT answer the question, "
#     "just reformulate it if needed and otherwise return it as is."
# )
# contextualize_q_prompt = ChatPromptTemplate.from_messages(
#     [
#         ("system", contextualize_q_system_prompt),
#         MessagesPlaceholder("chat_history"),
#         ("human", "{input}"),
#     ]
# )
# history_aware_retriever = create_history_aware_retriever(llm, retriever, contextualize_q_prompt)

# qa_system_prompt = (
#     "You are an expert at psychology and cardiology. With an H index of 110 you have written a ton of "
#     "research papers and have an experience of over 25 years in medical "
#     "science and a PHD as well in cardiology. So please help the user find out the best response to any user "
#     "and use the document provided as the base and then you could follow up with any source."
#     "Also do not exceed 50 words. Do not try to answer with bold letters , italic letters or tables. Keep the response simple and to the point.\n\n"
#     "{context}"
# )
# qa_prompt = ChatPromptTemplate.from_messages(
#     [
#         ("system", qa_system_prompt),
#         MessagesPlaceholder("chat_history"),
#         ("human", "{input}"),
#     ]
# )
# question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

# rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)
# chat_history = []

# print("RAG chain initialized successfully.")


# def ask_question(question: str):
#     """Handles a single user query and maintains chat history."""
#     global chat_history
#     response = rag_chain.invoke({"input": question, "chat_history": chat_history})
#     chat_history.append(HumanMessage(content=question))
#     chat_history.append(AIMessage(content=response["answer"]))
#     return response["answer"]


# import os
# from dotenv import load_dotenv
# from langchain_huggingface import HuggingFaceEmbeddings
# from langchain_community.vectorstores import FAISS
# from langchain.chains import create_history_aware_retriever, create_retrieval_chain
# from langchain.chains.combine_documents import create_stuff_documents_chain
# from langchain_groq import ChatGroq
# from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
# from langchain_core.messages import HumanMessage, AIMessage

# load_dotenv()
# groq_api_key = os.getenv("GROQ_API_KEY")
# if not groq_api_key:
#     raise ValueError("GROQ_API_KEY not found in .env file or environment variables")

# print("Loading vector store from 'faiss_index'...")

# # Define the writable cache directory (matches the one in the Dockerfile)
# cache_dir = "/app/cache"

# # Load embeddings, explicitly telling it where to cache the model
# embedding = HuggingFaceEmbeddings(
#     model_name="sentence-transformers/all-MiniLM-L6-v2",
#     cache_folder=cache_dir
# )

# vector_store = FAISS.load_local(
#     "faiss_index",
#     embeddings=embedding,
#     allow_dangerous_deserialization=True
# )
# retriever = vector_store.as_retriever()
# print("Vector store loaded successfully.")

# llm = ChatGroq(model="openai/gpt-oss-20b", api_key=groq_api_key)

# contextualize_q_system_prompt = (
#     "Given a chat history and the latest user question "
#     "which might reference context in the chat history, "
#     "formulate a standalone question which can be understood "
#     "without the chat history. Do NOT answer the question, "
#     "just reformulate it if needed and otherwise return it as is."
# )
# contextualize_q_prompt = ChatPromptTemplate.from_messages(
#     [
#         ("system", contextualize_q_system_prompt),
#         MessagesPlaceholder("chat_history"),
#         ("human", "{input}"),
#     ]
# )
# history_aware_retriever = create_history_aware_retriever(llm, retriever, contextualize_q_prompt)

# qa_system_prompt = (
#     "You are an expert at psychology and cardiology. With an H index of 110 you have written a ton of "
#     "research papers and have an experience of over 25 years in medical "
#     "science and a PHD as well in cardiology. So please help the user find out the best response to any user "
#     "and use the document provided as the base and then you could follow up with any source."
#     "Also do not exceed 50 words. Do not try to answer with bold letters , italic letters or tables. Keep the response simple and to the point.\n\n"
#     "{context}"
# )
# qa_prompt = ChatPromptTemplate.from_messages(
#     [
#         ("system", qa_system_prompt),
#         MessagesPlaceholder("chat_history"),
#         ("human", "{input}"),
#     ]
# )
# question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

# rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)
# chat_history = []

# print("RAG chain initialized successfully.")


# def ask_question(question: str):
#     """Handles a single user query and maintains chat history."""
#     global chat_history
#     response = rag_chain.invoke({"input": question, "chat_history": chat_history})
#     chat_history.append(HumanMessage(content=question))
#     chat_history.append(AIMessage(content=response["answer"]))
#     return response["answer"]





# VERSION 3
import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage

# --- Load Environment Variables and API Keys ---
load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
    raise ValueError("GROQ_API_KEY not found in .env file or environment variables")

print("Loading vector store from 'faiss_index'...")

# --- Load Embeddings and Vector Store ---
# Define a writable cache directory (matches the one in the Dockerfile)
cache_dir = "/app/cache"
embedding = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    cache_folder=cache_dir
)
vector_store = FAISS.load_local(
    "faiss_index",
    embeddings=embedding,
    allow_dangerous_deserialization=True
)
retriever = vector_store.as_retriever()
print("Vector store loaded successfully.")

# --- Initialize the Language Model ---
llm = ChatGroq(model="llama3-8b-8192", api_key=groq_api_key) # Switched to a more recent model for better performance

# --- Define the RAG Chain for Context-Aware Chat ---

# 1. Prompt to reformulate the user's question based on history
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

# 2. Prompt for the main QA task, including retrieved context
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

# 3. Combine the chains into the final RAG chain
rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

print("RAG chain initialized successfully.")

# ====================================================================================
# FIX: The ask_question function is now stateless.
# - It accepts the 'history' for a specific user's session as an argument.
# - It does NOT use a global variable anymore.
# - It returns the standalone answer, which the server will send to the user.
# ====================================================================================
def ask_question(question: str, history: list):
    """
    Handles a user query using the RAG chain and the provided chat history.
    Args:
        question: The user's latest question.
        history: The conversation history for this specific user.
    Returns:
        The generated answer string.
    """
    # Convert the simple history list from the API into LangChain Message objects
    chat_history_messages = []
    for message in history:
        if message.get("type") == "human":
            chat_history_messages.append(HumanMessage(content=message.get("content")))
        elif message.get("type") == "ai":
            chat_history_messages.append(AIMessage(content=message.get("content")))

    # Invoke the RAG chain with the question and the formatted history
    response = rag_chain.invoke({"input": question, "chat_history": chat_history_messages})
    
    # Return only the answer text
    return response["answer"]