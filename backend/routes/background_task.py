from fastapi_mail import FastMail, MessageSchema, MessageType
from mail import conf
from database import db

async def send_emails(job_data:dict):
    subscribers = await db.subscribers.find().to_list(None)
    emails = [sub["email"] for sub in subscribers]

    template = f"""
                <html>
                <body>    
                <p>Hii from JobPortal !!!
                    <br>
                    A new job posted check it out.
                    <br>
                    <b>
                    Job Title - {job_data["title"]} 
                    <br> 
                    Company - {job_data["company"]}
                    </b>
                </p>
                </body>
                </html>
                """
        
    for email in emails:
        try:
            message = MessageSchema(
                subject="🚀 New Job Posted!",
                recipients=[email],  
                body=template,
                subtype=MessageType.html
                )
        
            fm = FastMail(conf)
            await fm.send_message(message)        
        except Exception as e:
            print(f"Error in sending email to {email}")

    print(f"Email sent to all subscribers.")