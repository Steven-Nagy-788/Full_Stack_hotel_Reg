using System.Security.Cryptography;
namespace Hotel_Reserv.Services;
public sealed class PasswordHasher : IPasswordHasher
{
    private const int SaltSize = 16;
    private const int HashSize = 32;
    private const int Iterations = 10000;
    private readonly HashAlgorithmName algorithmName = HashAlgorithmName.SHA512;
    public string Hash(string password)
    {
        byte[] salt = RandomNumberGenerator.GetBytes(SaltSize);
        byte[] hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, algorithmName, HashSize);
        return $"{Convert.ToHexString(hash)} - {Convert.ToHexString(salt)}";
    }
}