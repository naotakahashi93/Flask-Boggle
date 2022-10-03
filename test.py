from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):
    # TODO -- write tests for every view function / feature!
    
    def setUp(self):
        """Stuff to do before every test."""

        self.client = app.test_client()
        app.config['TESTING'] = True
    
    def test_homepage(self):
        
        with self.client:
            resp = self.client.get("/") # here we are creating a response to the "/" route using test_client
            self.assertIn("board", session)
            self.assertIn("numplay", session)
            self.assertEqual(resp.status_code, 200)

    def test_words(self):
        with self.client.session_transaction() as sess: 
            sess["board"] = [['K', 'D', 'N', 'B', 'Z'],['R', 'Y', 'O', 'F', 'M'],['Q', 'F', 'I', 'K', 'Z'],['H', 'G', 'S', 'T', 'A'],['E', 'N', 'O', 'Z', 'B']]
            resp = self.client.get("/checkword?guess=no")
            self.assertEqual(resp.json['result'], 'ok')# checking to see if the response given by hitting the /checkword route is a JSON




