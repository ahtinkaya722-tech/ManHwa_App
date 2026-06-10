import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ahtin09500!",
    database: "manga_app"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Connected to MySQL database");
    }
});

app.delete('/deleteManga/:userId/:mangaId',(req,res)=>{
const {userId,mangaId}=req.params;
const query =" Delete from saved_manga where user_id= ? and manga_id =?"
db.query(query,[userId,mangaId],(err,result)=>{
if(err){
    console.log(err);
    res.status(500).json({success:false,Message:"Database error"})
    return
}

if(result.affectedRows > 0){
    return res.json({success:true,Message:"Manga has been removed from the library"});
}else{
 return res.json({success:false,Message:"Manga Not Found,Database Error"});
}

});



})

app.get(`/getUserLibrary/:userId`, async (req, res) => {
    const {userId}=req.params;
    try{
        const [result]=await db.promise().query("select * from saved_manga where user_id=?",[userId]);
     
    
      if(result.length>0){
        res.json({MangaInLibrary:result});
      } 
    }catch(err){
      console.log("Error checking Library:", err);
      res.status(500).json({error: "Internal server error"});
    }


});
app.get(`/checkLibrary/:userId/:mangaId`, async (req, res) => {
    const {userId,mangaId}=req.params;
    try{
        const [result]=await db.promise().query("select * from saved_manga where user_id=? and manga_id=?",[userId,mangaId]);
      res.json({inLibrary:result.length>0}); 
    }catch(err){
      console.log("Error checking Library:", err);
      res.status(500).json({error: "Internal server error"});
    }


});
app.post("/addLibrary/added",async(req,res)=>{

const {userId,mangaId}=req.body;

try{
  const [result] = await db.promise().query("insert ignore into  saved_manga (user_id,manga_id) values (?,?)",[userId,mangaId]);
 res.json({message:"Manga added to Library",status:"success"});
 console.log("SQL Result:", result);

}catch(err){
    res.status(500).json(err);
}

}
)
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json("Email already exists");
                return res.status(500).json(err);
            }
            res.status(201).json({ message: "User registered successfully" });
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

app.post("/signin", (req, res) => {
    const { emailOrUsername, password } = req.body;
    console.log("Signin attempt for:", emailOrUsername);
    
    // Using emailOrUsername to query the database for either email or username
    db.query("Select * from users where email = ? OR username = ?", [emailOrUsername, emailOrUsername], async (err, result) => {
        if (err) {
            console.error("Database error during signin:", err);
            return res.status(500).json(err);
        }
        
        console.log("Database result:", result);

        if (result.length === 0) {
            console.log("No user found with email or username:", emailOrUsername);
            return res.status(404).json("User not found");
        }

        const user = result[0];
        console.log("User found:", user);
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json("Invalid password");

        const token = jwt.sign({ id: user.id }, "secretkey", { expiresIn: "24h" });
        res.json({ token, message: "Login successful", user: { id: user.id, email: user.email, name: user.username }});
    })
});
app.listen(5000, () => {
    console.log("Server running on port 5000");
});

