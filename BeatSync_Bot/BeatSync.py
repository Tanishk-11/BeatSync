import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
# NEW IMPORTS for chat history
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage

# Load environment variables
load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
    raise ValueError("GROQ_API_KEY not found in .env file or environment variables")

# --- 1. Load the Saved Vector Store ---
print("Loading vector store from 'faiss_index'...")
embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vector_store = FAISS.load_local(
    "faiss_index",
    embeddings=embedding,
    allow_dangerous_deserialization=True
)
retriever = vector_store.as_retriever()
print("Vector store loaded successfully.")


# --- 2. Define the CONVERSATIONAL RAG Chain ---
llm = ChatGroq(model="openai/gpt-oss-20b", api_key=groq_api_key)

# NEW: This prompt helps rephrase a follow-up question into a standalone one
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
history_aware_retriever = create_history_aware_retriever(
    llm, retriever, contextualize_q_prompt
)


# NEW: This prompt now includes a placeholder for chat history
qa_system_prompt = (
    "You are an expert at psychology and cardiology. With an H index of 110 you have written a ton of "
    "research papers and have an experience of over 25 years in medical "
    "science and a PHD as well in cardiology. So please help the user find out the best response to any user "
    "and use the document provided as the base and then you could follow up with any source\n\n"
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

# This is the final, conversational chain
rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

print("\nConversational RAG chain created. You can now ask questions.")


# --- 3. Run the QA Loop with Chat History ---
# NEW: Initialize an empty list to store the history
chat_history = []

while True:
    question = input("\nAsk a question (or type 'quit' to exit): ").strip()
    if question.lower() == "quit":
        break
    if not question:
        continue

    print("...thinking...")
    
    # MODIFIED: Pass the chat history into the chain
    response = rag_chain.invoke({"input": question, "chat_history": chat_history})
    
    print("\n--- Answer ---")
    print(response['answer'])

    # NEW: Add the user's question and the AI's answer to the history
    chat_history.append(HumanMessage(content=question))
    chat_history.append(AIMessage(content=response["answer"]))