from flask import Flask,request,send_file
from flask_cors import CORS

app = Flask(__name__)
import qrcode
import requests
import face_recognition
import cv2
import os
import jsonify
import PyPDF2
#import fitz  # PyMuPDF
import os
import io  # Import io for BytesIO
# Specify the allowed origin
#they are used for send data from server to client and client to server.They are highly used for api's callings
cors=CORS(app)


@app.route('/', methods = ['GET']) 
def home(): 
    data = "hello world"
    return data

@app.route('/myfunction', methods=['GET'])
def hello():
    # Access query parameters
    document_cid = request.args.get('param2')
    document_name = request.args.get('param1')
    print(document_cid,document_name)
    # Check if the parameters are present
   
    # Your code to process the query parameters goes here
    img_io = my_function("https://gateway.pinata.cloud/ipfs/"+document_cid)
    return send_file(img_io, mimetype='image/png', as_attachment=True, download_name='qr_code.png')
    

def my_function(url):
    # Replace this with your IPFS CID
    ipfs_cid = url
  
    # Create a QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(ipfs_cid)
    qr.make(fit=True)

    # Create an image of the QR code
    img = qr.make_image(fill_color="black", back_color="white")

    # Save the image to a BytesIO object
    img_io = io.BytesIO()
    img.save(img_io, 'PNG')
    img_io.seek(0)  # Move the pointer to the start of the file
    return img_io



@app.route('/liveface', methods=['GET'])
def live_face():
  document_cid = request.args.get('param1')
  document_name = request.args.get('param2')
  print(document_cid)
  # URL of the image you want to compare against
  
  image_url = "https://gateway.pinata.cloud/ipfs/"
  image_url+=str(document_cid)
 
  print(image_url)
# Download the image from the URL
  response = requests.get(image_url)
  
  known_image = face_recognition.load_image_file(io.BytesIO(response.content))
  known_face_encoding = face_recognition.face_encodings(known_image)[0]

  # Initialize the webcam
  cap = cv2.VideoCapture(0)
  flag=0
  while True:
    ret, frame = cap.read()

    if not ret:
        print("Error reading the webcam feed.")
        break

    # Find face locations in the live frame
    face_locations = face_recognition.face_locations(frame)
    
    if len(face_locations) > 0:
        # Encode the live face
        live_face_encoding = face_recognition.face_encodings(frame, face_locations)[0]

        # Compare the live face to the known face
        results = face_recognition.compare_faces([known_face_encoding], live_face_encoding)

        if results[0]:
            print("Match found! The live face matches the known face.")
            flag=1
            break
            
        else:
            print("No match found. The live face does not match the known face.")
            

    cv2.imshow('Live Face Comparison', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
  if flag==1: 
    return "Yes"
  else:
    return "No"       
  cap.release()
  cv2.destroyAllWindows()

@app.route('/encryptpdf', methods=['POST'])
def encrypt_pdf():
    if 'file' not in request.files:
        return {'success': False, 'message': 'No file part in the request.'}, 400

    file = request.files['file']
    output_pdf = request.form.get('param2')  # You can specify the output file name
    password = request.form.get('param3')

    if file.filename == '':
        return {'success': False, 'message': 'No selected file.'}, 400

    if file and allowed_file(file.filename):  # Implement allowed_file to check for PDF
        with open(file.filename, 'rb') as input_pdf:
            pdf_reader = PyPDF2.PdfReader(input_pdf)
            pdf_writer = PyPDF2.PdfWriter()

            for page_num in range(len(pdf_reader.pages)):
                pdf_writer.add_page(pdf_reader.pages[page_num])

            pdf_writer.encrypt(password)

            # Save the encrypted PDF
            with open(output_pdf, 'wb') as output_file:
                pdf_writer.write(output_file)

        return {'success': True, 'message': 'PDF encrypted successfully.'}

    return {'success': False, 'message': 'Invalid file type.'}, 400

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() == 'pdf'

if __name__ == "__main__":
    # Get the port from the environment variable (default to 5000 if not set)
    port = int(os.environ.get('PORT', 5000))
    
    # Bind to 0.0.0.0 and use the environment port
    app.run(host='0.0.0.0', port=port)
