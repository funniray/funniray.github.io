import com.eatthepath.otp.TimeBasedOneTimePasswordGenerator;
import org.apache.commons.codec.binary.Base32;

import javax.crypto.KeyGenerator;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidKeyException;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;

public class Main {

    public static void main(String[] args) throws NoSuchAlgorithmException, InvalidKeyException {
        genKey();
        //TimeBasedOneTimePasswordGenerator totp = new TimeBasedOneTimePasswordGenerator();
        //Base32 b32 = new Base32();
        //byte [] decodedKey = b32.decode("ZYA4K57WZ5GIO33R5J7MN37ZNA");
        //Key key = new SecretKeySpec(decodedKey, 0, decodedKey.length, totp.getAlgorithm());
        //Instant now = Instant.now();
        //System.out.println(totp.generateOneTimePassword(key,now));
    }

    public static void genKey() throws NoSuchAlgorithmException, InvalidKeyException {
        TimeBasedOneTimePasswordGenerator totp = new TimeBasedOneTimePasswordGenerator();
        Base32 b32 = new Base32();
        KeyGenerator keyGen = KeyGenerator.getInstance(totp.getAlgorithm());
        keyGen.init(128);
        Key key = keyGen.generateKey();
        Instant now = Instant.now();
        System.out.println(b32.encodeToString(key.getEncoded()));
        System.out.println(totp.generateOneTimePassword(key,now));
    }
}
