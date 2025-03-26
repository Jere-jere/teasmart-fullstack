from typing import Dict, Text, Any, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import json
import os

class ExampleAction(Action):
    def name(self) -> Text:
        return "action_example"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text="Hello from a custom action!")
        return []

class ActionQueryKnowledgeBase(Action):
    def name(self) -> Text:
        return "action_query_knowledge_base"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        # Path to the knowledge base JSON file
        knowledge_base_path = os.path.join(os.path.dirname(__file__), "knowledge_base.json")

        # Load the knowledge base
        try:
            with open(knowledge_base_path, "r") as f:
                knowledge_base = json.load(f)
        except FileNotFoundError:
            dispatcher.utter_message(text="Sorry, I couldn't find the knowledge base.")
            return []

        # Get the user's message
        user_query = tracker.latest_message.get("text")

        # Search the knowledge base for a matching question
        answer = self.query_knowledge_base(user_query, knowledge_base)

        if answer:
            dispatcher.utter_message(text=answer)
        else:
            # Provide suggestions if no answer is found
            suggestions = self.get_suggestions(user_query, knowledge_base)
            if suggestions:
                suggestion_text = "You might be looking for:\n"
                suggestion_text += "\n".join([f"- {suggestion}" for suggestion in suggestions])
                dispatcher.utter_message(text=suggestion_text)
            else:
                dispatcher.utter_message(text="I'm sorry, I don't know the answer to that.")

        return []

    def query_knowledge_base(self, query: Text, knowledge_base: List[Dict[Text, Text]]) -> Text:
        # Search for a matching question in the knowledge base
        for entry in knowledge_base:
            if query.lower() in entry["question"].lower():
                return entry["answer"]
        return None

    def get_suggestions(self, query: Text, knowledge_base: List[Dict[Text, Text]]) -> List[Text]:
        # Generate suggestions based on the user's query
        suggestions = []
        for entry in knowledge_base:
            if query.lower() in entry["question"].lower():
                suggestions.append(entry["question"])
        return suggestions[:3]  # Return up to 3 suggestions