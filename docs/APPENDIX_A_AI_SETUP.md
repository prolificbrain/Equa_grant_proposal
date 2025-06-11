# Appendix A – AI Integration Setup Guide

---

# 🤖 AI Integration Setup Guide

## Quick Setup (2 minutes)

1. **Get your OpenAI API Key**:
   - Go to https://platform.openai.com/api-keys
   - Create a new API key
   - Copy the key (starts with `sk-`)

2. **Add to your environment**:
   ```bash
   # Create .env file in project root
   echo "VITE_OPENAI_API_KEY=your_api_key_here" > .env
   ```

3. **Test the AI**:
   - Start the app: `npm run dev`
   - Go through onboarding
   - Describe a conflict and see real AI analysis! ✨

## What's Now AI-Powered

### 🔍 **Conflict Analysis with Memory Enhancement**
- Real GPT-4.1 analysis of relationship conflicts
- Memory-aware pattern recognition from past interactions
- Identifies underlying issues and emotions with historical context
- Suggests which pillar to focus on first based on relationship history
- Provides specific next steps with contextual awareness

### 💎 **Truth Statement Processing with Memory Integration**
- AI analyzes each truth statement for:
  - Emotional undertones with historical context
  - Underlying needs and interests compared to past expressions
  - Suggestions for constructive responses based on what's worked before
  - Patterns across statements and across time using memory graph
  - Consistency tracking with previous truth statements

### 🎯 **Smart Insights with Memory Graph**
- Context-aware responses based on conversation history and relationship memory
- Personalized suggestions for each partner using past successful approaches
- Evidence-based conflict resolution techniques tailored to recurring patterns
- Empathetic, non-judgmental guidance with recognition of growth over time
- Relationship progress visualization through memory-based insights

## AI System Prompt

Our AI is trained with EQuA's core principles and memory integration:

```
You are EQuA v2, an AI mediator specializing in relationship 
conflict resolution with secure on-device memory capabilities. 
You guide couples through six evidence-based pillars and leverage 
a proprietary memory graph system that securely stores relationship 
patterns, insights, and history:

1. Truth - Epistemic transparency & verifiable facts
2. Mediation - Principled negotiation workflow  
3. Persuasion - Autonomy-supportive influence
4. Reframing - Cognitive reappraisal & context shifts
5. Qualia - First-person felt-sense & interoception
6. Forgiveness - REACH & restorative justice models

Key Principles:
- Separate people from the problem
- Focus on interests, not positions
- Validate both perspectives without taking sides
- Use "I" statements and avoid blame language
- Encourage empathy and perspective-taking
```

## Fallback Behavior

If no API key is provided:
- App still works perfectly
- Shows helpful fallback messages
- Maintains all functionality
- Perfect for demos without API costs

## Cost Estimation

- **Conflict Analysis**: ~$0.01-0.02 per session
- **Truth Statements**: ~$0.005 per statement
- **Total per session**: Usually under $0.10

Your free credits should handle hundreds of demo sessions! 🚀

## Memory + AI Integration

### Current Memory-AI Interfaces
- **Pattern Recognition**: AI accesses encrypted memory graph for pattern detection
- **Progress Tracking**: Memory system feeds historical data for growth analysis
- **Sentiment Comparison**: Current emotions compared to historical baselines
- **Privacy Controls**: User-configured memory access boundaries for AI

## Next Steps

Ready to add more AI + Memory features:
- Real-time reframing suggestions with memory-aware context
- Emotion detection and qualia mapping with historical baselines
- REACH forgiveness workflow guidance with memory of past hurts
- Mediation facilitation with turn management informed by communication patterns
- Relationship forecasting based on memory graph trajectory

The foundation is solid - we can add any AI + Memory capability you want! ✨

---

(End of Appendix A)
